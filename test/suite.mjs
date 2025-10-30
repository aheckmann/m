#!/usr/bin/env node

import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const M_BIN = resolve('.', 'bin', 'm');
const M_PREFIX = join(tmpdir(), 'm-test-' + Date.now());

function run(args = [], opts = {}) {
  const timeout = opts.timeout ?? 60_000;
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      M_CACHE: '0',
      ...opts.env ?? {},
      M_PREFIX,
      M_CONFIRM: '0',
    };

    const child = spawn(M_BIN, args, { env });
    let stdout = '';
    let stderr = '';

    const t = setTimeout(() => {
      child.kill();
      resolve({
        stdout,
        stderr,
        exitCode: -1
      });
    }, timeout);

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(t);
      resolve({
        stdout,
        stderr,
        exitCode: code || 0
      });
    });
  });
}

async function getAllVersions() {
  const result = await run(['ls']);
  const all = result.stdout.split('\n').filter(Boolean).map(v => v.trim());
  return all;
}

async function getInstalledVersions() {
  const all = await getAllVersions();
  const installed = all.filter(version => /^\*/.test(version));
  return installed;
}

async function getUninstalledVersions() {
  const all = await getAllVersions();
  const uninstalled = all.filter(version => !/^\*/.test(version));
  return uninstalled;
}

describe('m - MongoDB Version Management', { concurrency: 5 }, () => {
  after(() => {
    if (existsSync(M_PREFIX)) {
      try {
        rmSync(M_PREFIX, { recursive: true, force: true });
      } catch (error) {
        console.warn('Warning: Could not clean up test directory:', error.message);
      }
    }
  });

  describe('Basic Information Commands', () => {
    test('should display version with -V flag', async () => {
      const result = await run(['-V']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^\d+\.\d+\.\d+\n$/);
    });

    test('should display version with --version flag', async () => {
      const result = await run(['--version']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^\d+\.\d+\.\d+\n$/);
    });

    test('should display help with -h flag', async () => {
      const result = await run(['-h']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /m v\d+\.\d+\.\d+ \(MongoDB Version Management\)/);
      assert.match(result.stdout, /Usage: m \[options\] \[COMMAND\] \[config\]/);
      assert.match(result.stdout, /Commands:/);
      assert.match(result.stdout, /Options:/);
      assert.match(result.stdout, /Aliases:/);
    });

    test('should display help with --help flag', async () => {
      const result = await run(['--help']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /m v\d+\.\d+\.\d+ \(MongoDB Version Management\)/);
    });

    test('should display help with help command', async () => {
      const result = await run(['help']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /m v\d+\.\d+\.\d+ \(MongoDB Version Management\)/);
    });
  });

  describe('Version Listing Commands', () => {
    describe('Aliases for ls command', { concurrency: 1 }, () => {
      const aliases = ['ls', 'list', 'available', 'avail'];
      for (const alias of aliases) {
        test(`should list available versions with "${alias}" alias`, async () => {
          const result = await run([alias], { env: { M_CACHE: '1' } });
          assert.equal(result.exitCode, 0);
          // Should contain some version numbers
          assert.match(result.stdout, /\d+\.\d+\.\d+/);
        });
      }
    });

    test('should show latest stable version with --stable', async () => {
      const result = await run(['--stable']);
      assert.equal(result.exitCode, 0, result.stdout);
      assert.match(result.stdout, /^\d+\.\d+\.\d+\n$/, result.stdout);
    });

    test('should show latest version with --latest', async () => {
      const result = await run(['--latest']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^\d+\.\d+\.\d+/, result.stdout);
    });

    test('should show latest stable version for series with --stable X.Y', async () => {
      const result = await run(['--stable', '7.0']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^7\.0\.\d+\n$/, result.stdout);
    });

    test('should show latest version for series with --latest X.Y', async () => {
      const result = await run(['--latest', '7.0']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^7\.0\.\d+/, result.stdout);
    });
  });

  describe('Installed Versions Commands', { concurrency: 1 }, () => {
    test('should show installed versions (initially empty)', async () => {
      const result = await run(['installed']);
      assert.equal(result.exitCode, 0);
      // Should show "No installed versions" or similar when none are installed
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should show installed versions with lls alias', async () => {
      const result = await run(['lls']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should show installed versions in JSON format', async () => {
      const result = await run(['installed', '--json']);
      assert.equal(result.exitCode, 0);
      // Should be valid JSON (empty array when no versions installed)
      assert.doesNotThrow(() => JSON.parse(result.stdout));
      assert.deepEqual(JSON.parse(result.stdout), []);
    });

    test('should show no installed versions when run without arguments', async () => {
      const result = await run([]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });
  });

  describe('Install Commands', { concurrency: 1 }, () => {
    let version = null;

    before(async () => {
      const uninstalled = await getUninstalledVersions();
      // race conditions in the mongodb release process may cause latest to not
      // be installable so we pick the second to last uninstalled version.
      version = uninstalled[uninstalled.length - 2];
    });

    test('should install the given version', async () => {
      const result = await run([version]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, new RegExp(`Activating: MongoDB Server ${version}`, 'i'));
    });

    test('should reactivate the version if already installed', async () => {
      const result = await run([version]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, new RegExp(`Already Active: MongoDB Server ${version}`, 'i'));
    });

    test('should reinstall the version if already installed', async () => {
      const result = await run(['reinstall', version]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, new RegExp(`Removed MongoDB version ${version}`, 'i'));
      assert.match(result.stdout, new RegExp(`Activating: MongoDB Server ${version}`, 'i'));
    });

    test('installed version should be marked with checkmark in ls output', async () => {
      const result = await run(['ls']);
      assert.equal(result.exitCode, 0);
      // The active version should have a checkmark
      assert.match(result.stdout, new RegExp(`✔ ${version}`));
    });

    test('installed version should be marked with checkmark in installed output', async () => {
      const result = await run(['installed']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, new RegExp(`✔ ${version}`));
    });

    test('should uninstall the version', async () => {
      const result = await run(['rm', version]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, new RegExp(`Removed MongoDB version ${version}`, 'i'));
    });

    if (process.env.ImageOS === 'ubuntu22') {
      test('mongo 4.2 installs on ubuntu22 - #156', async () => {
        const version = '4.2';
        const result1 = await run([version], { env: { M_DEBUG: '1' } });
        console.log('debug\n', result1.stderr.split('\n').map(l => `  ${l}`).join('\n'));
        assert.match(result1.stdout, new RegExp(`Activating: MongoDB Server ${version}`, 'i'));
        assert.equal(result1.exitCode, 0);
        const result2 = await run();
        assert.match(result2.stdout, new RegExp(version, 'i'));
        assert.equal(result2.exitCode, 0);
      })
    }
  });

  describe('Source URL Commands', () => {
    test('should show source URL for a version', async () => {
      const result = await run(['src', '7.0.0']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /^http.*mongodb-src-r7\.0\.0\.tar\.gz\n$/);
    });

    test('should fail when no version provided to src command', async () => {
      const result = await run(['src']);
      assert.equal(result.exitCode, 1);
      assert.match(result.stdout, /version required/);
    });
  });

  describe('Binary Path Commands', () => {
    test('should fail to show bin path for non-installed version', async () => {
      const result = await run(['bin', '7.0.0']);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail to show bin path with which alias for non-installed version', async () => {
      const result = await run(['which', '7.0.0']);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail when no version provided to bin command', async () => {
      const result = await run(['bin']);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /version required/);
    });
  });

  describe('Database Tools Commands', () => {
    test('should list database tools versions', async () => {
      const result = await run(['tools', 'ls']);
      assert.equal(result.exitCode, 0);
      // Should contain version numbers
      assert.match(result.stdout, /\d+\.\d+\.\d+/);
    });

    test('should show installed database tools (initially empty)', async () => {
      const result = await run(['tools', 'installed']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should show installed database tools in JSON format', async () => {
      const result = await run(['tools', 'installed', '--json']);
      assert.equal(result.exitCode, 0);
      assert.doesNotThrow(() => JSON.parse(result.stdout));
    });

    test('should show installed tools when called without arguments', async () => {
      const result = await run(['tools']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should remove database tools version', async () => {
      const result = await run(['tools', 'rm', '100.9.4']);
      assert.equal(result.exitCode, 0);
      // Should succeed or indicate version not installed
      assert.doesNotMatch(result.stdout, /line \d+:/);
    });
  });

  describe('MongoDB Shell (mongosh) Commands', { concurrency: 1 }, () => {
    test('should list mongosh versions with ls command', async () => {
      const result = await run(['mongosh', 'ls']);
      assert.equal(result.exitCode, 0);
      // Should contain version numbers
      assert.match(result.stdout, /\d+\.\d+\.\d+/);
    });

    // intentionally not testing ls aliases to avoid github rate limits

    test('should show installed mongosh versions (initially empty)', async () => {
      const result = await run(['mongosh', 'installed']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should show installed mongosh versions with lls alias', async () => {
      const result = await run(['mongosh', 'lls']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should show installed mongosh versions in JSON format', async () => {
      const result = await run(['mongosh', 'installed', '--json']);
      assert.equal(result.exitCode, 0);
      assert.doesNotThrow(() => JSON.parse(result.stdout));
      const parsed = JSON.parse(result.stdout);
      assert.ok(Array.isArray(parsed));
    });

    test('should show installed mongosh when called without arguments', async () => {
      const result = await run(['mongosh']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /(No installed versions|^\s*$)/);
    });

    test('should remove mongosh version', async () => {
      const result = await run(['mongosh', 'rm', '2.3.7']);
      assert.equal(result.exitCode, 0);
      // Should succeed or indicate version not installed
      assert.doesNotMatch(result.stdout, /line \d+:/);
    });

    test('should handle removing multiple mongosh versions', async () => {
      const result = await run(['mongosh', 'rm', '2.3.0', '2.3.1']);
      assert.equal(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.doesNotMatch(result.stdout, /line \d+:/);
    });

    test('should install latest stable mongosh with stable command', async () => {
      const result = await run(['mongosh', 'stable'], { timeout: 120_000 });
      assert.equal(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /Installation complete: MongoDB Shell \d+\.\d+\.\d+/);
    });

    test('installed mongosh should appear in installed list', async () => {
      await run(['mongosh', '2.5.6'], { timeout: 120_000 });
      const result = await run(['mongosh', 'installed']);
      assert.equal(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /2\.5\.6/);
    });

    test('should reactivate already installed mongosh version', async () => {
      const installedResult = await run(['mongosh', 'installed', '--json']);
      const installed = JSON.parse(installedResult.stdout);
      assert.ok(installed.length > 0, 'Should have at least one installed mongosh version');
      const version = installed[0].name; // JSON uses 'name' field
      const result = await run(['mongosh', version]);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /already active|Installation complete/i);
    });

    test('should clean up installed mongosh after tests', async () => {
      const installedResult = await run(['mongosh', 'installed', '--json']);
      const installed = JSON.parse(installedResult.stdout);
      if (installed.length > 0) {
        const versions = installed.map(v => v.name); // JSON uses 'name' field
        const result = await run(['mongosh', 'rm', ...versions]);
        assert.equal(result.exitCode, 0);
      }
      const installedResult2 = await run(['mongosh', 'installed', '--json']);
      const installed2 = JSON.parse(installedResult2.stdout);
      assert.ok(installed2.length === 0, 'Should have no installed mongosh versions');
    });
  });

  describe('Hook Management Commands', () => {
    const testDir = join(resolve('.'), 'test', 'hooks');
    const failPath = join(testDir, 'fail');
    const passPath = join(testDir, 'pass');

    test('should list pre install hooks (initially empty)', async () => {
      const result = await run(['pre', 'install']);
      assert.equal(result.exitCode, 0);
    });

    test('should list post install hooks (initially empty)', async () => {
      const result = await run(['post', 'install']);
      assert.equal(result.exitCode, 0);
    });

    test('should list pre change hooks (initially empty)', async () => {
      const result = await run(['pre', 'change']);
      assert.equal(result.exitCode, 0);
    });

    test('should list post change hooks (initially empty)', async () => {
      const result = await run(['post', 'change']);
      assert.equal(result.exitCode, 0);
    });

    test('should fail with invalid hook event', async () => {
      const result = await run(['pre', 'invalid']);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /invalid hook event/);
    });

    test('should add and remove a valid hook', async () => {
      const a = await run(['pre', 'install', passPath]);
      assert.equal(a.exitCode, 0, a.stdout);
      const b = await run(['pre', 'install', 'rm', passPath]);
      assert.equal(b.exitCode, 0, b.stdout);
    });

    test('should fail to add non-executable script as hook', async () => {
      const result = await run(['pre', 'install', failPath]);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /not an executable file/);
    });

    test('should fail to add non-absolute path script as hook', async () => {
      const result = await run(['post', 'install', './bin/m']);
      assert.notEqual(result.exitCode, 0);
      assert.match(result.stdout, /not an absolute path/);
    });
  });

  describe('Version Management Commands (Error Cases)', () => {
    test('should fail to execute mongod for non-installed version', async () => {
      const result = await run(['use', '7.0.0', '--version']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail to execute mongos for non-installed version', async () => {
      const result = await run(['shard', '7.0.0', '--version']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail to execute mongo shell for non-installed version', async () => {
      const result = await run(['shell', '7.0.0', '--version']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail to execute mongo shell with s alias for non-installed version', async () => {
      const result = await run(['s', '7.0.0', '--version']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail to execute mongo shell with mongo alias for non-installed version', async () => {
      const result = await run(['mongo', '7.0.0', '--version']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('shell command should fallback to legacy mongo', async () => {
      const result1 = await run(['4.4.29']);
      assert.equal(result1.exitCode, 0, `${result1.stdout} ${result1.stderr}`);

      const result2 = await run(['s', '4.4.29', '--version']);
      if (result2.exitCode === 0) {
        // Legacy mongo shell may not be installable in all CI environments
        assert.match(result2.stdout, /version v4.4.29/);
      }
    });

    test('should succeed when removing non-installed version', async () => {
      const result = await run(['rm', '7.0.0']);
      assert.equal(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /not installed/);
    });

    test('should fail when no version provided to use command', async () => {
      const result = await run(['use']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version required/);
    });

    test('should fail when no version provided to shard command', async () => {
      const result = await run(['shard']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version required/);
    });

    test('should fail when no version provided to shell command', async () => {
      const result = await run(['shell']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version required/);
    });

    test('should fail when no version provided to s alias', async () => {
      const result = await run(['s']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version required/);
    });

    test('should fail when no version provided to mongo alias', async () => {
      const result = await run(['mongo']);
      assert.notEqual(result.exitCode, 0, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version required/);
    });

    test('should fail when no version provided to rm command', async () => {
      const result = await run(['rm']);
      assert.equal(result.exitCode, 1, `${result.stdout} ${result.stderr}`);
      assert.match(result.stdout, /version.*required/);
    });
  });

  describe('Invalid Commands and Arguments', () => {
    test('should handle unknown commands gracefully', async () => {
      const result = await run(['unknown-command']);
      // The script should either show help or treat it as a version
      // In either case, it shouldn't crash
      assert.doesNotMatch(result.stdout, /line \d+:/); // No bash syntax errors
    });

    test('should handle invalid version formats', async () => {
      const result = await run(['invalid.version.format']);
      // Should either fail gracefully or attempt to parse
      assert.doesNotMatch(result.stdout, /line \d+:/); // No bash syntax errors
    });
  });

  describe('Series Version Parsing', () => {
    test('should handle version series format for ls command', async () => {
      const result = await run(['ls', '7.0']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /7\.0\.\d+/);
      assert.doesNotMatch(result.stdout, /^8\.\d+\.\d+\n$/);
    });

    test('should handle version series format for latest command', async () => {
      const result = await run(['--latest', '8.0']);
      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /8\.0\.\d+/);
      assert.ok(result.stdout.split(/\n/).length, 1);
      assert.doesNotMatch(result.stdout, /^7\..+\n$/);
    });
  });
});

console.log('Running m test suite...');
