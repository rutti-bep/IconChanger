
package 'build-essential' do
	action :install
end

package 'wget' do
	action :install
end

package 'libssl-dev' do
	action :install
end

execute 'node-install' do
	user 'root'
	command 'wget http://nodejs.org/dist/v4.4.4/node-v4.4.4.tar.gz; tar zxvf node-v4.4.4.tar.gz; node-v4.4.4/configure; make -C node-v4.4.4; make -C node-v4.4.4 install'
	not_if "test -e /usr/local/bin/node"
end

package 'svtools' do
		action :install
end

package 'daemontools-run' do
		action :install
end

directory "/service/" do
  action :create
end

git "iconChanger" do
	destination "/service/IconChanger"
	repository "https://github.com/rutti-bep/IconChanger.git"
end

directory "/etc/service/IconChanger/log" do 
	action :create
	not_if "test -e /etc/service/IconChanger/log"
end

file "/etc/service/IconChanger/run" do
	action :create
	content "#!/bin/sh
					 exec 2>&1
 					 exec env - SESSION_SECRET=\"#{node[:SESSION_SECRET]}\" \
					 TWITTER_CONSUMER_KEY=\"#{node[:TWITTER_CONSUMER_KEY]}\" \
					 TWITTER_CONSUMER_SECRET=\"#{node[:TWITTER_CONSUMER_SECRET]}\" \
					 IPSetting=\"#{node[:IPSetting]}\" \
					 PORT=\"8000\"\
					 NODE_ENV=production /usr/local/bin/node /service/IconChanger/app.js"
	not_if "test -e /etc/service/IconChanger/run"
end


file "/etc/service/IconChanger/log/run" do
	action :create
	content File.read('send/logrun')
	not_if "test -e /etc/service/IconChanger/log/run"
end

execute "npm-install" do
	user 'root'
	command "cd /service/IconChanger/ && npm install"
end

