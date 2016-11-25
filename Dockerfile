FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install wget -y
RUN apt-get install build-essential -y
RUN apt-get install libssl-dev -y
RUN	apt-get install npm -y

RUN wget http://nodejs.org/dist/v4.4.4/node-v4.4.4.tar.gz 
RUN tar zxvf node-v4.4.4.tar.gz
RUN cd node-v4.4.4 && \
	  ./configure && \
	  make && \
		make install 

ADD . /
RUN cd / && \
		npm install
CMD	node app.js
