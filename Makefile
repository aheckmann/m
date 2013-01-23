
M_PREFIX ?= /usr/local

nothing:

install: bin/m
		cp $< $(M_PREFIX)/$<

uninstall:
		rm -f $(M_PREFIX)/bin/m

.PHONY: install uninstall nothing
