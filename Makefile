default: buildandserve

buildandserve:
	make build && make serve

build:
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