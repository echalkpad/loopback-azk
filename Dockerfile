FROM node:latest

MAINTAINER Willian Ribeiro Angelo <"agfoccus@gmail.com">

RUN npm i -g strongloop pm2

# Commands will run in this directory
WORKDIR /home/app

# Add all our code inside that directory that lives in the container
ADD . /home/app

# RUN npm i 

EXPOSE 3000

CMD ["/bin/bash"]