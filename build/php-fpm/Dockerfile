FROM php:5.6-fpm

MAINTAINER Gordian Dziwis <gordian.dziwis@gmail.com>

# Install Xdebug
RUN pecl install xdebug 

# Install modules
RUN docker-php-ext-install sockets 
RUN docker-php-ext-install mbstring 

RUN mkdir -p /var/www/MonsterMinigame
WORKDIR /var/www/MonsterMinigame
CMD ["php-fpm"]

