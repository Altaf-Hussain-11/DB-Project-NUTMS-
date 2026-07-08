-- =====================================================================
-- NUTMS - Database Schema (Web Application Version)
-- Builds on the original dbDDL.sql; adds BOOKING_PASSENGER for
-- Special Trip Request passenger details (name + designation per seat).
-- No Fuel Consumption / Audit Log tables (kept out of scope per request).
-- =====================================================================
CREATE DATABASE IF NOT EXISTS NUTMS;
USE NUTMS;

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS VIEW_Active_Trips_Fleet;
DROP TABLE IF EXISTS BOOKING_PASSENGER;
DROP TABLE IF EXISTS GPS;
DROP TABLE IF EXISTS DRIVER_VE_ASSIGNMENT;
DROP TABLE IF EXISTS VEHICLE_MAINTENANCE;
DROP TABLE IF EXISTS TRIP;
DROP TABLE IF EXISTS BOOKING;
DROP TABLE IF EXISTS SCHEDULE;
DROP TABLE IF EXISTS ROUTE_STOP;
DROP TABLE IF EXISTS STOP;
DROP TABLE IF EXISTS ROUTE;
DROP TABLE IF EXISTS VEHICLE;
DROP TABLE IF EXISTS ADMINISTRATOR;
DROP TABLE IF EXISTS DRIVER;
DROP TABLE IF EXISTS FACULTY;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS USER;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- CORE USER TABLES
-- =====================================================================
CREATE TABLE USER (
    User_ID INT AUTO_INCREMENT,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    role_id ENUM('Student', 'Faculty', 'Driver', 'Administrator') NOT NULL,
    Profile_Photo VARCHAR(255) DEFAULT NULL,
    Created_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_User PRIMARY KEY (User_ID),
    CONSTRAINT UQ_User_Email UNIQUE (Email)
);

CREATE TABLE STUDENT (
    Registration_No VARCHAR(30) NOT NULL,
    User_ID INT NOT NULL,
    Residential_Type ENUM('Hosteler', 'Day Scholar') NOT NULL,
    CONSTRAINT PK_Student PRIMARY KEY (Registration_No),
    CONSTRAINT UQ_Student_User UNIQUE (User_ID),
    CONSTRAINT FK_Student_User FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE FACULTY (
    employee_id VARCHAR(20) NOT NULL,
    User_ID INT NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Faculty PRIMARY KEY (employee_id),
    CONSTRAINT UQ_Faculty_User UNIQUE (User_ID),
    CONSTRAINT FK_Faculty_User FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE DRIVER (
    driver_id VARCHAR(20) NOT NULL,
    User_ID INT NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    license_expiry DATE NOT NULL,
    hire_date DATE NOT NULL,
    emergency_contact VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
    driver_status ENUM('Active', 'On Leave', 'Terminated') NOT NULL,
    CONSTRAINT PK_Driver PRIMARY KEY (driver_id),
    CONSTRAINT UQ_Driver_User UNIQUE (User_ID),
    CONSTRAINT UQ_Driver_License UNIQUE (license_number),
    CONSTRAINT FK_Driver_User FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ADMINISTRATOR (
    User_ID INT NOT NULL,
    Admin_Level ENUM('Super Admin', 'Regular Admin') NOT NULL,
    CONSTRAINT PK_Administrator PRIMARY KEY (User_ID),
    CONSTRAINT FK_Administrator_User FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================================
-- ROUTES, STOPS, SCHEDULES
-- =====================================================================
CREATE TABLE ROUTE (
    Route_ID INT AUTO_INCREMENT,
    Start_Location VARCHAR(150) NOT NULL,
    Route_Name VARCHAR(100) NOT NULL,
    End_Location VARCHAR(150) NOT NULL,
    Total_Distance_km DECIMAL(6,2) NOT NULL CHECK (Total_Distance_km > 0),
    Estimated_Duration_min INT NOT NULL CHECK (Estimated_Duration_min > 0),
    CONSTRAINT PK_Route PRIMARY KEY (Route_ID),
    CONSTRAINT UQ_Route_Name UNIQUE (Route_Name)
);

CREATE TABLE STOP (
    Stop_ID INT AUTO_INCREMENT,
    Stop_Name VARCHAR(100) NOT NULL,
    Sequence_Number INT NOT NULL CHECK (Sequence_Number > 0),
    Arrival_Offset_min INT NOT NULL CHECK (Arrival_Offset_min >= 0),
    CONSTRAINT PK_Stop PRIMARY KEY (Stop_ID)
);

CREATE TABLE ROUTE_STOP (
    Route_ID INT NOT NULL,
    Stop_ID INT NOT NULL,
    Sequence_Number INT NOT NULL CHECK (Sequence_Number > 0),
    Arrival_Offset_min INT NOT NULL CHECK (Arrival_Offset_min >= 0),
    CONSTRAINT PK_Route_Stop PRIMARY KEY (Route_ID, Stop_ID),
    CONSTRAINT FK_RouteStop_Route FOREIGN KEY (Route_ID) REFERENCES ROUTE(Route_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_RouteStop_Stop FOREIGN KEY (Stop_ID) REFERENCES STOP(Stop_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE SCHEDULE (
    Schedule_ID INT AUTO_INCREMENT,
    Departure_from VARCHAR(150) NOT NULL,
    Destination VARCHAR(150) NOT NULL,
    Departure_Time TIME NOT NULL,
    Days_Of_Week VARCHAR(100) NOT NULL,
    Effective_From DATE NOT NULL,
    Effective_Until DATE DEFAULT NULL,
    Route_ID INT NOT NULL,
    Admin_ID INT NOT NULL,
    CONSTRAINT PK_Schedule PRIMARY KEY (Schedule_ID),
    CONSTRAINT FK_Schedule_Route FOREIGN KEY (Route_ID) REFERENCES ROUTE(Route_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_Schedule_Admin FOREIGN KEY (Admin_ID) REFERENCES ADMINISTRATOR(User_ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =====================================================================
-- VEHICLES, MAINTENANCE
-- =====================================================================
CREATE TABLE VEHICLE (
    Vehicle_ID INT AUTO_INCREMENT,
    Registration_Plate VARCHAR(15) NOT NULL,
    Seating_Capacity INT NOT NULL CHECK (Seating_Capacity > 0),
    Make_Model VARCHAR(80) NOT NULL,
    Operational_Status ENUM('Active', 'Under Maintenance', 'Retired') NOT NULL,
    GPS_Device_ID VARCHAR(50) DEFAULT NULL,
    CONSTRAINT PK_Vehicle PRIMARY KEY (Vehicle_ID),
    CONSTRAINT UQ_Vehicle_Plate UNIQUE (Registration_Plate),
    CONSTRAINT UQ_Vehicle_GPS UNIQUE (GPS_Device_ID)
);

CREATE TABLE VEHICLE_MAINTENANCE (
    maintenance_id INT AUTO_INCREMENT,
    maintenance_type VARCHAR(80) NOT NULL,
    description TEXT DEFAULT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_cost DECIMAL(10,2) NOT NULL CHECK (maintenance_cost >= 0),
    Vehicle_ID INT NOT NULL,
    CONSTRAINT PK_Maintenance PRIMARY KEY (maintenance_id),
    CONSTRAINT FK_Maintenance_Vehicle FOREIGN KEY (Vehicle_ID) REFERENCES VEHICLE(Vehicle_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================================
-- TRIPS
-- =====================================================================
CREATE TABLE TRIP (
    Trip_ID INT AUTO_INCREMENT,
    Trip_Date DATE NOT NULL,
    Trip_Status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
    Departure_Time DATETIME DEFAULT NULL,
    Schedule_ID INT NOT NULL,
    Vehicle_ID INT NOT NULL,
    CONSTRAINT PK_Trip PRIMARY KEY (Trip_ID),
    CONSTRAINT FK_Trip_Schedule FOREIGN KEY (Schedule_ID) REFERENCES SCHEDULE(Schedule_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_Trip_Vehicle FOREIGN KEY (Vehicle_ID) REFERENCES VEHICLE(Vehicle_ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =====================================================================
-- SPECIAL TRIP REQUESTS (BOOKING) + PASSENGER DETAILS
-- =====================================================================
CREATE TABLE BOOKING (
    Booking_ID INT AUTO_INCREMENT,
    Destination VARCHAR(200) NOT NULL,
    Trip_Date DATE NOT NULL,
    Departure_Time TIME NOT NULL,
    Purpose TEXT NOT NULL,
    Passenger_Count INT NOT NULL CHECK (Passenger_Count > 0),
    Status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    Admin_Comments TEXT DEFAULT NULL,
    Requested_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Resolved_At DATETIME DEFAULT NULL,
    employee_id VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Booking PRIMARY KEY (Booking_ID),
    CONSTRAINT FK_Booking_Faculty FOREIGN KEY (employee_id) REFERENCES FACULTY(employee_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- One row per passenger travelling on a special trip request
CREATE TABLE BOOKING_PASSENGER (
    Passenger_ID INT AUTO_INCREMENT,
    Booking_ID INT NOT NULL,
    Passenger_Name VARCHAR(100) NOT NULL,
    Designation VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Booking_Passenger PRIMARY KEY (Passenger_ID),
    CONSTRAINT FK_BookingPassenger_Booking FOREIGN KEY (Booking_ID) REFERENCES BOOKING(Booking_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================================
-- DRIVER-VEHICLE ASSIGNMENTS
-- =====================================================================
CREATE TABLE DRIVER_VE_ASSIGNMENT (
    Assignment_id INT AUTO_INCREMENT,
    Driver_id VARCHAR(20) NOT NULL,
    Vehicle_id INT NOT NULL,
    assigned_from DATETIME NOT NULL,
    assigned_to DATETIME DEFAULT NULL,
    Assigned_by INT NOT NULL,
    Assignment_status ENUM('Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Active',
    CONSTRAINT PK_Assignment PRIMARY KEY (Assignment_id),
    CONSTRAINT FK_Assignment_Driver FOREIGN KEY (Driver_id) REFERENCES DRIVER(driver_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_Assignment_Vehicle FOREIGN KEY (Vehicle_id) REFERENCES VEHICLE(Vehicle_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_Assignment_Admin FOREIGN KEY (Assigned_by) REFERENCES ADMINISTRATOR(User_ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =====================================================================
-- GPS LOGS
-- =====================================================================
CREATE TABLE GPS (
    Log_ID INT AUTO_INCREMENT,
    Timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Latitude DECIMAL(9,6) NOT NULL,
    Longitude DECIMAL(9,6) NOT NULL,
    Speed_kmph INT DEFAULT NULL CHECK (Speed_kmph >= 0),
    Vehicle_ID INT NOT NULL,
    CONSTRAINT PK_Gps PRIMARY KEY (Log_ID),
    CONSTRAINT FK_Gps_Vehicle FOREIGN KEY (Vehicle_ID) REFERENCES VEHICLE(Vehicle_ID) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IDX_GPS_Vehicle_Time ON GPS (Vehicle_ID, Timestamp);
CREATE INDEX IDX_Trip_Date_Status ON TRIP (Trip_Date, Trip_Status);

-- =====================================================================
-- VIEWS
-- =====================================================================
CREATE VIEW VIEW_Active_Trips_Fleet AS
SELECT t.Trip_ID, t.Trip_Date, s.Departure_from, s.Destination, v.Registration_Plate, v.GPS_Device_ID
FROM TRIP t
JOIN SCHEDULE s ON t.Schedule_ID = s.Schedule_ID
JOIN VEHICLE v ON t.Vehicle_ID = v.Vehicle_ID
WHERE t.Trip_Status = 'In Progress';
