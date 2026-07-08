-- =====================================================================
-- NUTMS - Stored Procedures, Functions, and Triggers
-- All GUI database operations are routed through these objects only.
-- Run AFTER dbDDL.sql and dbDML.sql
-- =====================================================================
USE NUTMS;

DELIMITER //

-- =====================================================================
-- 1. USER MANAGEMENT
-- =====================================================================

-- Add a new user (generic)
-- Get a single user by email (used for login/authentication)
DROP PROCEDURE IF EXISTS sp_GetUserByEmail //
CREATE PROCEDURE sp_GetUserByEmail (IN p_Email VARCHAR(150))
BEGIN
    SELECT 
        u.User_ID,
        u.Full_Name,
        u.Email,
        u.Password_Hash,
        u.role_id,
        u.Created_At
    FROM USER u
    WHERE u.Email = p_Email
    LIMIT 1;
END //
DROP PROCEDURE IF EXISTS sp_AddUser //
CREATE PROCEDURE sp_AddUser (
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(150),
    IN p_PasswordHash VARCHAR(255),
    IN p_Role ENUM('Student','Faculty','Driver','Administrator')
)
BEGIN
    INSERT INTO USER (Full_Name, Email, Password_Hash, role_id)
    VALUES (p_FullName, p_Email, p_PasswordHash, p_Role);
    SELECT LAST_INSERT_ID() AS New_User_ID;
END //

-- Update a user's basic info
DROP PROCEDURE IF EXISTS sp_UpdateUser //
CREATE PROCEDURE sp_UpdateUser (
    IN p_UserID INT,
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(150)
)
BEGIN
    UPDATE USER
    SET Full_Name = p_FullName, Email = p_Email
    WHERE User_ID = p_UserID;
END //

-- Delete a user (cascades to role tables)
DROP PROCEDURE IF EXISTS sp_DeleteUser //
CREATE PROCEDURE sp_DeleteUser (IN p_UserID INT)
BEGIN
    DELETE FROM USER WHERE User_ID = p_UserID;
END //

-- Retrieve all users (optionally filtered by role)
DROP PROCEDURE IF EXISTS sp_GetUsers //
CREATE PROCEDURE sp_GetUsers (IN p_Role VARCHAR(20))
BEGIN
    IF p_Role IS NULL OR p_Role = 'All' THEN
        SELECT User_ID, Full_Name, Email, role_id, Created_At FROM USER ORDER BY User_ID;
    ELSE
        SELECT User_ID, Full_Name, Email, role_id, Created_At FROM USER
        WHERE role_id = p_Role ORDER BY User_ID;
    END IF;
END //


-- =====================================================================
-- 2. STUDENT MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddStudent //
CREATE PROCEDURE sp_AddStudent (
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(150),
    IN p_PasswordHash VARCHAR(255),
    IN p_RegNo VARCHAR(30),
    IN p_ResType ENUM('Hosteler','Day Scholar')
)
BEGIN
    DECLARE v_UserID INT;
    START TRANSACTION;
        INSERT INTO USER (Full_Name, Email, Password_Hash, role_id)
        VALUES (p_FullName, p_Email, p_PasswordHash, 'Student');
        SET v_UserID = LAST_INSERT_ID();
        INSERT INTO STUDENT (Registration_No, User_ID, Residential_Type)
        VALUES (p_RegNo, v_UserID, p_ResType);
    COMMIT;
END //

DROP PROCEDURE IF EXISTS sp_GetStudents //
CREATE PROCEDURE sp_GetStudents ()
BEGIN
    SELECT s.Registration_No, u.User_ID, u.Full_Name, u.Email, s.Residential_Type
    FROM STUDENT s JOIN USER u ON s.User_ID = u.User_ID
    ORDER BY s.Registration_No;
END //

DROP PROCEDURE IF EXISTS sp_UpdateStudent //
CREATE PROCEDURE sp_UpdateStudent (
    IN p_RegNo VARCHAR(30),
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(150),
    IN p_ResType ENUM('Hosteler','Day Scholar')
)
BEGIN
    DECLARE v_UserID INT;
    SELECT User_ID INTO v_UserID FROM STUDENT WHERE Registration_No = p_RegNo;
    UPDATE USER SET Full_Name = p_FullName, Email = p_Email WHERE User_ID = v_UserID;
    UPDATE STUDENT SET Residential_Type = p_ResType WHERE Registration_No = p_RegNo;
END //

DROP PROCEDURE IF EXISTS sp_DeleteStudent //
CREATE PROCEDURE sp_DeleteStudent (IN p_RegNo VARCHAR(30))
BEGIN
    DECLARE v_UserID INT;
    SELECT User_ID INTO v_UserID FROM STUDENT WHERE Registration_No = p_RegNo;
    DELETE FROM USER WHERE User_ID = v_UserID; -- cascades
END //


-- =====================================================================
-- 3. VEHICLE MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddVehicle //
CREATE PROCEDURE sp_AddVehicle (
    IN p_Plate VARCHAR(15),
    IN p_Capacity INT,
    IN p_MakeModel VARCHAR(80),
    IN p_Status ENUM('Active','Under Maintenance','Retired'),
    IN p_GPS VARCHAR(50)
)
BEGIN
    INSERT INTO VEHICLE (Registration_Plate, Seating_Capacity, Make_Model, Operational_Status, GPS_Device_ID)
    VALUES (p_Plate, p_Capacity, p_MakeModel, p_Status, p_GPS);
END //

DROP PROCEDURE IF EXISTS sp_GetVehicles //
CREATE PROCEDURE sp_GetVehicles ()
BEGIN
    SELECT * FROM VEHICLE ORDER BY Vehicle_ID;
END //

DROP PROCEDURE IF EXISTS sp_UpdateVehicleStatus //
CREATE PROCEDURE sp_UpdateVehicleStatus (
    IN p_VehicleID INT,
    IN p_Status ENUM('Active','Under Maintenance','Retired')
)
BEGIN
    UPDATE VEHICLE SET Operational_Status = p_Status WHERE Vehicle_ID = p_VehicleID;
END //

DROP PROCEDURE IF EXISTS sp_DeleteVehicle //
CREATE PROCEDURE sp_DeleteVehicle (IN p_VehicleID INT)
BEGIN
    DELETE FROM VEHICLE WHERE Vehicle_ID = p_VehicleID;
END //


-- =====================================================================
-- 4. ROUTE & STOP MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddRoute //
CREATE PROCEDURE sp_AddRoute (
    IN p_StartLoc VARCHAR(150),
    IN p_RouteName VARCHAR(100),
    IN p_EndLoc VARCHAR(150),
    IN p_Distance DECIMAL(6,2),
    IN p_Duration INT
)
BEGIN
    INSERT INTO ROUTE (Start_Location, Route_Name, End_Location, Total_Distance_km, Estimated_Duration_min)
    VALUES (p_StartLoc, p_RouteName, p_EndLoc, p_Distance, p_Duration);
END //

DROP PROCEDURE IF EXISTS sp_GetRoutes //
CREATE PROCEDURE sp_GetRoutes ()
BEGIN
    SELECT * FROM ROUTE ORDER BY Route_ID;
END //

DROP PROCEDURE IF EXISTS sp_DeleteRoute //
CREATE PROCEDURE sp_DeleteRoute (IN p_RouteID INT)
BEGIN
    DELETE FROM ROUTE WHERE Route_ID = p_RouteID;
END //

DROP PROCEDURE IF EXISTS sp_GetRouteStops //
CREATE PROCEDURE sp_GetRouteStops (IN p_RouteID INT)
BEGIN
    SELECT rs.Route_ID, r.Route_Name, st.Stop_ID, st.Stop_Name,
           rs.Sequence_Number, rs.Arrival_Offset_min
    FROM ROUTE_STOP rs
    JOIN ROUTE r ON rs.Route_ID = r.Route_ID
    JOIN STOP st ON rs.Stop_ID = st.Stop_ID
    WHERE rs.Route_ID = p_RouteID
    ORDER BY rs.Sequence_Number;
END //


-- =====================================================================
-- 5. SCHEDULE MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddSchedule //
CREATE PROCEDURE sp_AddSchedule (
    IN p_From VARCHAR(150),
    IN p_To VARCHAR(150),
    IN p_DepartureTime TIME,
    IN p_Days VARCHAR(100),
    IN p_EffectiveFrom DATE,
    IN p_RouteID INT,
    IN p_AdminID INT
)
BEGIN
    INSERT INTO SCHEDULE (Departure_from, Destination, Departure_Time, Days_Of_Week, Effective_From, Route_ID, Admin_ID)
    VALUES (p_From, p_To, p_DepartureTime, p_Days, p_EffectiveFrom, p_RouteID, p_AdminID);
END //

DROP PROCEDURE IF EXISTS sp_GetSchedules //
CREATE PROCEDURE sp_GetSchedules ()
BEGIN
    SELECT s.Schedule_ID, s.Departure_from, s.Destination, s.Departure_Time,
           s.Days_Of_Week, s.Effective_From, s.Effective_Until,
           r.Route_Name, s.Admin_ID
    FROM SCHEDULE s JOIN ROUTE r ON s.Route_ID = r.Route_ID
    ORDER BY s.Schedule_ID;
END //

DROP PROCEDURE IF EXISTS sp_DeleteSchedule //
CREATE PROCEDURE sp_DeleteSchedule (IN p_ScheduleID INT)
BEGIN
    DELETE FROM SCHEDULE WHERE Schedule_ID = p_ScheduleID;
END //


-- =====================================================================
-- 6. TRIP MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddTrip //
CREATE PROCEDURE sp_AddTrip (
    IN p_TripDate DATE,
    IN p_ScheduleID INT,
    IN p_VehicleID INT
)
BEGIN
    INSERT INTO TRIP (Trip_Date, Trip_Status, Schedule_ID, Vehicle_ID)
    VALUES (p_TripDate, 'Scheduled', p_ScheduleID, p_VehicleID);
END //

-- Update trip status; trigger will auto-stamp Departure_Time when -> In Progress
DROP PROCEDURE IF EXISTS sp_UpdateTripStatus //
CREATE PROCEDURE sp_UpdateTripStatus (
    IN p_TripID INT,
    IN p_Status ENUM('Scheduled','In Progress','Completed','Cancelled')
)
BEGIN
    UPDATE TRIP SET Trip_Status = p_Status WHERE Trip_ID = p_TripID;
END //

DROP PROCEDURE IF EXISTS sp_GetTrips //
CREATE PROCEDURE sp_GetTrips (IN p_Status VARCHAR(20))
BEGIN
    IF p_Status IS NULL OR p_Status = 'All' THEN
        SELECT t.Trip_ID, t.Trip_Date, t.Trip_Status, t.Departure_Time,
               s.Departure_from, s.Destination, v.Registration_Plate
        FROM TRIP t
        JOIN SCHEDULE s ON t.Schedule_ID = s.Schedule_ID
        JOIN VEHICLE v ON t.Vehicle_ID = v.Vehicle_ID
        ORDER BY t.Trip_Date DESC, t.Trip_ID;
    ELSE
        SELECT t.Trip_ID, t.Trip_Date, t.Trip_Status, t.Departure_Time,
               s.Departure_from, s.Destination, v.Registration_Plate
        FROM TRIP t
        JOIN SCHEDULE s ON t.Schedule_ID = s.Schedule_ID
        JOIN VEHICLE v ON t.Vehicle_ID = v.Vehicle_ID
        WHERE t.Trip_Status = p_Status
        ORDER BY t.Trip_Date DESC, t.Trip_ID;
    END IF;
END //

DROP PROCEDURE IF EXISTS sp_DeleteTrip //
CREATE PROCEDURE sp_DeleteTrip (IN p_TripID INT)
BEGIN
    DELETE FROM TRIP WHERE Trip_ID = p_TripID;
END //


-- =====================================================================
-- 7. BOOKING MANAGEMENT (Faculty requests, Admin approval)
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddBooking //
CREATE PROCEDURE sp_AddBooking (
    IN p_Destination VARCHAR(200),
    IN p_TripDate DATE,
    IN p_DepartureTime TIME,
    IN p_Purpose TEXT,
    IN p_PassengerCount INT,
    IN p_EmployeeID VARCHAR(20)
)
BEGIN
    INSERT INTO BOOKING (Destination, Trip_Date, Departure_Time, Purpose, Passenger_Count, Status, employee_id)
    VALUES (p_Destination, p_TripDate, p_DepartureTime, p_Purpose, p_PassengerCount, 'Pending', p_EmployeeID);
END //

DROP PROCEDURE IF EXISTS sp_GetBookings //
CREATE PROCEDURE sp_GetBookings (IN p_Status VARCHAR(20))
BEGIN
    IF p_Status IS NULL OR p_Status = 'All' THEN
        SELECT b.Booking_ID, b.Destination, b.Trip_Date, b.Departure_Time, b.Purpose,
               b.Passenger_Count, b.Status, b.Admin_Comments, u.Full_Name AS Requested_By
        FROM BOOKING b
        JOIN FACULTY f ON b.employee_id = f.employee_id
        JOIN USER u ON f.User_ID = u.User_ID
        ORDER BY b.Booking_ID DESC;
    ELSE
        SELECT b.Booking_ID, b.Destination, b.Trip_Date, b.Departure_Time, b.Purpose,
               b.Passenger_Count, b.Status, b.Admin_Comments, u.Full_Name AS Requested_By
        FROM BOOKING b
        JOIN FACULTY f ON b.employee_id = f.employee_id
        JOIN USER u ON f.User_ID = u.User_ID
        WHERE b.Status = p_Status
        ORDER BY b.Booking_ID DESC;
    END IF;
END //

-- Approve / reject a booking with comments; trigger stamps Resolved_At
DROP PROCEDURE IF EXISTS sp_ResolveBooking //
CREATE PROCEDURE sp_ResolveBooking (
    IN p_BookingID INT,
    IN p_Status ENUM('Pending','Approved','Rejected'),
    IN p_Comments TEXT
)
BEGIN
    UPDATE BOOKING
    SET Status = p_Status, Admin_Comments = p_Comments
    WHERE Booking_ID = p_BookingID;
END //

DROP PROCEDURE IF EXISTS sp_DeleteBooking //
CREATE PROCEDURE sp_DeleteBooking (IN p_BookingID INT)
BEGIN
    DELETE FROM BOOKING WHERE Booking_ID = p_BookingID;
END //


-- =====================================================================
-- 8. DRIVER & ASSIGNMENT MANAGEMENT
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_GetDrivers //
CREATE PROCEDURE sp_GetDrivers ()
BEGIN
    SELECT d.driver_id, u.Full_Name, u.Email, d.license_number,
           d.license_expiry, d.hire_date, d.salary, d.driver_status
    FROM DRIVER d JOIN USER u ON d.User_ID = u.User_ID
    ORDER BY d.driver_id;
END //

DROP PROCEDURE IF EXISTS sp_UpdateDriverStatus //
CREATE PROCEDURE sp_UpdateDriverStatus (
    IN p_DriverID VARCHAR(20),
    IN p_Status ENUM('Active','On Leave','Terminated')
)
BEGIN
    UPDATE DRIVER SET driver_status = p_Status WHERE driver_id = p_DriverID;
END //

-- Assign driver to vehicle: closes any prior active assignment for that
-- driver/vehicle then opens a new one (handled via trigger logic too)
DROP PROCEDURE IF EXISTS sp_AssignDriverToVehicle //
CREATE PROCEDURE sp_AssignDriverToVehicle (
    IN p_DriverID VARCHAR(20),
    IN p_VehicleID INT,
    IN p_AdminID INT
)
BEGIN
    INSERT INTO DRIVER_VE_ASSIGNMENT (Driver_id, Vehicle_id, assigned_from, Assigned_by, Assignment_status)
    VALUES (p_DriverID, p_VehicleID, NOW(), p_AdminID, 'Active');
END //

DROP PROCEDURE IF EXISTS sp_GetAssignments //
CREATE PROCEDURE sp_GetAssignments ()
BEGIN
    SELECT a.Assignment_id, a.Driver_id, u.Full_Name AS Driver_Name, v.Registration_Plate,
           a.assigned_from, a.assigned_to, a.Assignment_status
    FROM DRIVER_VE_ASSIGNMENT a
    JOIN DRIVER d ON a.Driver_id = d.driver_id
    JOIN USER u ON d.User_ID = u.User_ID
    JOIN VEHICLE v ON a.Vehicle_id = v.Vehicle_ID
    ORDER BY a.Assignment_id DESC;
END //

DROP PROCEDURE IF EXISTS sp_EndAssignment //
CREATE PROCEDURE sp_EndAssignment (IN p_AssignmentID INT)
BEGIN
    UPDATE DRIVER_VE_ASSIGNMENT
    SET Assignment_status = 'Completed', assigned_to = NOW()
    WHERE Assignment_id = p_AssignmentID;
END //


-- =====================================================================
-- 9. GPS LOGGING
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddGPSLog //
CREATE PROCEDURE sp_AddGPSLog (
    IN p_Lat DECIMAL(9,6),
    IN p_Lng DECIMAL(9,6),
    IN p_Speed INT,
    IN p_VehicleID INT
)
BEGIN
    INSERT INTO GPS (Timestamp, Latitude, Longitude, Speed_kmph, Vehicle_ID)
    VALUES (NOW(), p_Lat, p_Lng, p_Speed, p_VehicleID);
END //

DROP PROCEDURE IF EXISTS sp_GetLatestGPS //
CREATE PROCEDURE sp_GetLatestGPS ()
BEGIN
    SELECT g.Vehicle_ID, v.Registration_Plate, g.Latitude, g.Longitude, g.Speed_kmph, g.Timestamp
    FROM GPS g
    JOIN VEHICLE v ON g.Vehicle_ID = v.Vehicle_ID
    WHERE g.Log_ID IN (
        SELECT MAX(Log_ID) FROM GPS GROUP BY Vehicle_ID
    )
    ORDER BY g.Vehicle_ID;
END //


-- =====================================================================
-- 10. VEHICLE MAINTENANCE
-- =====================================================================

DROP PROCEDURE IF EXISTS sp_AddMaintenance //
CREATE PROCEDURE sp_AddMaintenance (
    IN p_Type VARCHAR(80),
    IN p_Description TEXT,
    IN p_Date DATE,
    IN p_Cost DECIMAL(10,2),
    IN p_VehicleID INT
)
BEGIN
    INSERT INTO VEHICLE_MAINTENANCE (maintenance_type, description, maintenance_date, maintenance_cost, Vehicle_ID)
    VALUES (p_Type, p_Description, p_Date, p_Cost, p_VehicleID);
    -- Trigger fires AFTER INSERT to set vehicle status to 'Under Maintenance'
END //

DROP PROCEDURE IF EXISTS sp_GetMaintenanceByVehicle //
CREATE PROCEDURE sp_GetMaintenanceByVehicle (IN p_VehicleID INT)
BEGIN
    SELECT * FROM VEHICLE_MAINTENANCE WHERE Vehicle_ID = p_VehicleID ORDER BY maintenance_date DESC;
END //


-- =====================================================================
-- 11. FUNCTIONS
-- =====================================================================

-- Function: total fleet maintenance cost for a vehicle
DROP FUNCTION IF EXISTS fn_TotalMaintenanceCost //
CREATE FUNCTION fn_TotalMaintenanceCost (p_VehicleID INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_Total DECIMAL(10,2);
    SELECT COALESCE(SUM(maintenance_cost), 0) INTO v_Total
    FROM VEHICLE_MAINTENANCE WHERE Vehicle_ID = p_VehicleID;
    RETURN v_Total;
END //

-- Function: count of pending bookings
DROP FUNCTION IF EXISTS fn_PendingBookingsCount //
CREATE FUNCTION fn_PendingBookingsCount ()
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_Count INT;
    SELECT COUNT(*) INTO v_Count FROM BOOKING WHERE Status = 'Pending';
    RETURN v_Count;
END //

-- Function: number of active vehicles
DROP FUNCTION IF EXISTS fn_ActiveVehicleCount //
CREATE FUNCTION fn_ActiveVehicleCount ()
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_Count INT;
    SELECT COUNT(*) INTO v_Count FROM VEHICLE WHERE Operational_Status = 'Active';
    RETURN v_Count;
END //


-- =====================================================================
-- 12. TRIGGERS
-- =====================================================================

-- When a trip's status changes to 'In Progress', stamp Departure_Time.
DROP TRIGGER IF EXISTS trg_Trip_DepartureStamp //
CREATE TRIGGER trg_Trip_DepartureStamp
BEFORE UPDATE ON TRIP
FOR EACH ROW
BEGIN
    IF NEW.Trip_Status = 'In Progress' AND OLD.Trip_Status <> 'In Progress' THEN
        SET NEW.Departure_Time = NOW();
    END IF;
END //

-- When a booking's status changes from Pending to Approved/Rejected, stamp Resolved_At.
DROP TRIGGER IF EXISTS trg_Booking_ResolvedStamp //
CREATE TRIGGER trg_Booking_ResolvedStamp
BEFORE UPDATE ON BOOKING
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Pending' AND NEW.Status IN ('Approved','Rejected') THEN
        SET NEW.Resolved_At = NOW();
    END IF;
END //

-- After a maintenance record is inserted, mark the vehicle as 'Under Maintenance'.
DROP TRIGGER IF EXISTS trg_Maintenance_VehicleStatus //
CREATE TRIGGER trg_Maintenance_VehicleStatus
AFTER INSERT ON VEHICLE_MAINTENANCE
FOR EACH ROW
BEGIN
    UPDATE VEHICLE SET Operational_Status = 'Under Maintenance'
    WHERE Vehicle_ID = NEW.Vehicle_ID;
END //

-- Before inserting a new active driver-vehicle assignment, close any existing
-- active assignment for the same vehicle.
DROP TRIGGER IF EXISTS trg_Assignment_CloseExisting //
CREATE TRIGGER trg_Assignment_CloseExisting
BEFORE INSERT ON DRIVER_VE_ASSIGNMENT
FOR EACH ROW
BEGIN
    IF NEW.Assignment_status = 'Active' THEN
        UPDATE DRIVER_VE_ASSIGNMENT
        SET Assignment_status = 'Completed', assigned_to = NOW()
        WHERE Vehicle_id = NEW.Vehicle_id AND Assignment_status = 'Active';
    END IF;
END //


DELIMITER ;
