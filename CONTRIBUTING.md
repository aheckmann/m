## Automated npm publishing

Whenever a git tag which matches a semver pattern (vMAJOR.MINOR.PATCH) is
pushed, a
[CI job](https://github.com/aheckmann/m/blob/master/.github/workflows/npm-publish.yaml)
publishes the package to
[npm](https://www.npmjs.com/package/m) using
[Trusted Publishing](https://docs.npmjs.com/trusted-publishers).
