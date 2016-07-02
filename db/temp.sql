CREATE TABLE data (
    id INT NOT NULL AUTO_INCREMENT,
    hw_id INT NOT NULL,
    temp INT NOT NULL,
    pressure INT NOT NULL,
    hum INT NOT NULL,
    registered_at DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;
