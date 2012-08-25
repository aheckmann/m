
M_PREFIX ?= /usr/local

install: bin/m
		cp $< $(M_PREFIX)/$<

uninstall:
		rm -f $(M_PREFIX)/bin/m

.PHONY: install uninstall
