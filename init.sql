CREATE SCHEMA purchase;

CREATE TABLE purchase.customer (
    customer_code VARCHAR PRIMARY KEY,
    customer_name VARCHAR NOT NULL,
    customer_inn VARCHAR,
    customer_kpp VARCHAR,
    customer_legal_address VARCHAR,
    customer_postal_address VARCHAR,
    customer_email VARCHAR,
    customer_code_main VARCHAR REFERENCES purchase.customer(customer_code), 
    is_organization BOOLEAN,
    is_person BOOLEAN
);

CREATE TABLE purchase.lot (
    lot_name VARCHAR PRIMARY KEY,
    customer_code VARCHAR REFERENCES purchase.customer(customer_code),
    price NUMERIC NOT NULL,
    currency_code VARCHAR CHECK (currency_code IN ('RUB', 'USD', 'EUR')),
    nds_rate VARCHAR CHECK (nds_rate IN ('Без НДС', '18%', '20%')),
    place_delivery VARCHAR,
    date_delivery TIMESTAMP
);
