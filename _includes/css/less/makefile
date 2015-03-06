LESS_FILES = footer.less header.less main.less
CSS_FILES = $(LESS_FILES:.less=.css)

%.css: %.less
	lessc $< > ../$@

all: $(CSS_FILES)
