FROM node
ADD . /bookstore_api
WORKDIR /bookstore_api
RUN npm install

HEALTHCHECK --interval=60s --timeout=1s CMD curl --fail http://localhost:3000/health-status || exit 1

ENTRYPOINT ["./entrypoint.sh"]
CMD ["bookstore_api"]
