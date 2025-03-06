ALTER TABLE company_details ADD COLUMN subdomain VARCHAR(255) NOT NULL;
ALTER TABLE company_details ADD CONSTRAINT UNIQUE (subdomain);





npx sequelize-cli migration:generate --name update-test-model

npm run migration:generate
npm run migrate


npm run seed:generate demo-user-data
npm run seed

