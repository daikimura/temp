CREATE TABLE data (
    id INT NOT NULL AUTO_INCREMENT,
    hw_id INT NOT NULL,
    temp FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    hum FLOAT NOT NULL,
    registered_at DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;
