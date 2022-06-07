
M_PREFIX ?= /usr/local

nothing:

install: bin/m
		sudo cp $< $(M_PREFIX)/$<  # requires sudo now on mac

uninstall:
		sudo rm -f $(M_PREFIX)/bin/m  # requires sudo now on mac

.PHONY: install uninstall nothing
