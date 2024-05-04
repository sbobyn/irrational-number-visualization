default: buildandserve

SRC_FILES := $(shell find src/ -type f)
JS_FILES := $(shell find js/ -type f)
TS_CONFIG := tsconfig.json

buildandserve:
	make build && make serve

build: $(SRC_FILES) $(JS_FILES) $(TS_CONFIG)
	@echo Building...
	tsc 

serve:
	@echo Serving...
	servez .

clean:
	@echo Cleaning...
	rm -rf js/*

deploy:
	@echo Deploying...
	./deploy.sh