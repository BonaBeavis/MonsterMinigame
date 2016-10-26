up: git
	docker-compose -f ./build/docker-compose.yml up

restart: git
	docker-compose -f ./build/docker-compose.yml up --force-recreate

rebuild: git
	docker-compose -f ./build/docker-compose.yml up --force-recreate
git:
	git pull
	git checkout develop
