default: buildandserve

buildandserve:
	make build && make serve

build: src/*
	@echo Building...
	tsc 
	cp src/*.html build/ 

serve:
	@echo Serving...
	servez build

clean:
	@echo Cleaning...
	rm -rf build

deploy:
	@echo Deploying...
	./deploy.sh