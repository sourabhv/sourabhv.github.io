LESS_FILES = footer.less general.less header.less main.less
CSS_FILES = $(LESS_FILES:.less=.css)

%.css: %.less
	lessc $< > ../$@
	postcss --use autoprefixer ../$@ -o ../$@

all: $(CSS_FILES)
