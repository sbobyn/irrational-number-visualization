default: buildandserve

buildandserve:
	make build && make serve

build: src/*
	@echo Building...
	tsc 

serve:
	@echo Serving...
	servez .

clean:
	@echo Cleaning...
	rm -rf build

deploy:
	@echo Deploying...
	./deploy.sh