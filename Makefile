up: git
	docker-compose -f ./build/docker-compose.yml up

restart:
	docker-compose -f ./build/docker-compose.yml up -d --force-recreate

rebuild: git
	docker-compose -f ./build/docker-compose.yml up --force-recreate
git:
	git pull
	git checkout develop
