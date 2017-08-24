CREATE TABLE egginfo.egginfo (
  id INT NOT NULL AUTO_INCREMENT,
  code VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  farm VARCHAR(255) NULL,
  address VARCHAR(255) NULL,
  certification VARCHAR(255) NULL,
  test_agency VARCHAR(255) NULL,
  grabbed_sample_date VARCHAR(255) NULL,
  pesticide_name VARCHAR(255) NULL,
  pesticide_amount VARCHAR(255) NULL,
  standard VARCHAR(255) NULL,
  product_amount VARCHAR(255) NULL,
  breeding_size VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  PRIMARY KEY (id)
  );