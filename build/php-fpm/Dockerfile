FROM php:5.6-fpm

MAINTAINER Gordian Dziwis <gordian.dziwis@gmail.com>

RUN apt-get update && apt-get install -y lsof --no-install-recommends && rm -r /var/lib/apt/lists/*

# Install Xdebug
#WORKDIR /tmp
#RUN curl -O http://www.xdebug.org/files/xdebug-2.3.3.tgz
#RUN tar -xzf xdebug-2.3.3.tgz
#WORKDIR /tmp/xdebug-2.3.3/
#RUN /usr/local/bin/phpize
#RUN ./configure 
#RUN make
#RUN cp modules/xdebug.so /usr/local/lib/php/extensions/no-debug-non-zts-20131226  
RUN pecl install xdebug 


# Install modules
RUN docker-php-ext-install sockets 
RUN docker-php-ext-install mbstring 
RUN touch /var/log/myass
RUN mkdir -p /var/www/thesis
WORKDIR /var/www/thesis
CMD ["php-fpm"]

