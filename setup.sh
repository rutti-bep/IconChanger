#!/bin/sh

echo "hello!!"

sudo apt-get update 

sudo apt-get install wget -y && \
		 apt-get install build-essential -y && \
		 apt-get install libssl-dev -y && \
		 apt-get install npm -y

sudo wget http://nodejs.org/dist/v4.4.4/node-v4.4.4.tar.gz && \ 
		 tar zxvf node-v4.4.4.tar.gz
sudo cd node-v4.4.4 && \
		 ./configure && \
		 	make && \
			make install

echo "SESSION_SECRET?"
read  SESSION_SECRET
echo "TWITTER_CONSUMER_KEY?"
read TWITTER_CONSUMER_KEY
echo "TWITTER_CONSUMER_SECRET?"
read TWITTER_CONSUMER_SECRET
echo "IPSetting?"
read IPSetting

echo "export SESSION_SECRET=\"$SESSION_SECRET\"
			export TWITTER_CONSUMER_KEY=\"$TWITTER_CONSUMER_KEY\"
			export TWITTER_CONSUMER_SECRET=\"$TWITTER_CONSUMER_SECRET\"
			export IPSetting=\"$IPSetting\"" >> ~/.bash_profile 

sudo apt-get install git -y
git clone https://github.com/rutti-bep/IconChanger
cd IconChanger && node app.js
