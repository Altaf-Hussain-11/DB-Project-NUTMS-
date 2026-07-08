USE NUTMS;

-- =====================================================================
-- USERS (Administrators, Faculty, Drivers, Students)
-- =====================================================================
INSERT INTO USER (User_ID, Full_Name, Email, Password_Hash, role_id) VALUES
(1, 'Altaf Hussain', 'altaf.hussain@namal.edu.pk', '$2b$10$HashedPwUniqueData1', 'Administrator'),
(2, 'Rabia Ashraf', 'rabia.ashraf@namal.edu.pk', '$2b$10$HashedPwUniqueData2', 'Student'),
(3, 'Najia Nayab', 'najia.nayab@namal.edu.pk', '$2b$10$HashedPwUniqueData3', 'Faculty'),
(4, 'Muhammad Khan', 'm.khan@namal.edu.pk', '$2b$10$HashedPwUniqueData4', 'Driver'),
(5, 'Sajid Mehmood', 'sajid.m@namal.edu.pk', '$2b$10$HashedPwUniqueData5', 'Administrator'),
(6, 'Ahmad Ali', 'ahmad.ali@namal.edu.pk', '$2b$10$HashedPwUniqueData6', 'Student'),
(7, 'Fatima Sana', 'fatima.sana@namal.edu.pk', '$2b$10$HashedPwUniqueData7', 'Student'),
(8, 'Zainab Bibi', 'zainab.bibi@namal.edu.pk', '$2b$10$HashedPwUniqueData8', 'Student'),
(9, 'Dr. Tariq Mahmood', 'tariq.mahmood@namal.edu.pk', '$2b$10$HashedPwUniqueData9', 'Faculty'),
(10, 'Dr. Aisha Rehman', 'aisha.rehman@namal.edu.pk', '$2b$10$HashedPwUniqueData10', 'Faculty'),
(11, 'Abdul Sattar', 'a.sattar@namal.edu.pk', '$2b$10$HashedPwUniqueData11', 'Driver'),
(12, 'Ghulam Raza', 'g.raza@namal.edu.pk', '$2b$10$HashedPwUniqueData12', 'Driver'),
(13, 'Tariq Jameel', 't.jameel@namal.edu.pk', '$2b$10$HashedPwUniqueData13', 'Driver'),
(14, 'Bilal Siddique', 'bilal.s@namal.edu.pk', '$2b$10$HashedPwUniqueData14', 'Student'),
(15, 'Hamza Malik', 'hamza.malik@namal.edu.pk', '$2b$10$HashedPwUniqueData15', 'Student');

INSERT INTO USER (User_ID, Full_Name, Email, Password_Hash, role_id) VALUES
(16, 'Saima Tariq', 'saima.tariq@namal.edu.pk', '$2b$10$HashedPwUniqueData16', 'Student'),
(17, 'Usman Ghani', 'usman.ghani@namal.edu.pk', '$2b$10$HashedPwUniqueData17', 'Student'),
(18, 'Ayesha Noor', 'ayesha.noor@namal.edu.pk', '$2b$10$HashedPwUniqueData18', 'Student'),
(19, 'Imran Yousaf', 'imran.yousaf@namal.edu.pk', '$2b$10$HashedPwUniqueData19', 'Student'),
(20, 'Mehwish Akram', 'mehwish.akram@namal.edu.pk', '$2b$10$HashedPwUniqueData20', 'Student'),
(21, 'Kashif Nawaz', 'kashif.nawaz@namal.edu.pk', '$2b$10$HashedPwUniqueData21', 'Student'),
(22, 'Sara Javed', 'sara.javed@namal.edu.pk', '$2b$10$HashedPwUniqueData22', 'Student'),
(23, 'Dr. Faisal Iqbal', 'faisal.iqbal@namal.edu.pk', '$2b$10$HashedPwUniqueData23', 'Faculty'),
(24, 'Dr. Hina Shaukat', 'hina.shaukat@namal.edu.pk', '$2b$10$HashedPwUniqueData24', 'Faculty'),
(25, 'Mudassar Iqbal', 'mudassar.iqbal@namal.edu.pk', '$2b$10$HashedPwUniqueData25', 'Driver'),
(26, 'Zubair Khan', 'zubair.khan@namal.edu.pk', '$2b$10$HashedPwUniqueData26', 'Driver'),
(27, 'Naveed Akhtar', 'naveed.akhtar@namal.edu.pk', '$2b$10$HashedPwUniqueData27', 'Administrator');

-- =====================================================================
-- ADMINISTRATORS
-- =====================================================================
INSERT INTO ADMINISTRATOR (User_ID, Admin_Level) VALUES
(1, 'Super Admin'),
(5, 'Regular Admin'),
(27, 'Regular Admin');

-- =====================================================================
-- STUDENTS
-- =====================================================================
INSERT INTO STUDENT (Registration_No, User_ID, Residential_Type) VALUES
('NUM-BSCS-2024-11', 2, 'Hosteler'),
('NUM-BSCS-2024-65', 6, 'Day Scholar'),
('NUM-BSCS-2024-62', 7, 'Hosteler'),
('NUM-BBA-2023-01', 8, 'Day Scholar'),
('NUM-BEE-2022-44', 14, 'Hosteler'),
('NUM-BSCS-2025-09', 15, 'Day Scholar'),
('NUM-BSCS-2024-21', 16, 'Hosteler'),
('NUM-BBA-2024-07', 17, 'Day Scholar'),
('NUM-BSCS-2023-33', 18, 'Hosteler'),
('NUM-BEE-2023-12', 19, 'Day Scholar'),
('NUM-BSCS-2025-18', 20, 'Hosteler'),
('NUM-BBA-2025-04', 21, 'Day Scholar'),
('NUM-BSCS-2024-50', 22, 'Hosteler');

-- =====================================================================
-- FACULTY
-- =====================================================================
INSERT INTO FACULTY (employee_id, User_ID, department, designation) VALUES
('EMP-01', 3, 'Computer Sciences', 'Assistant Professor'),
('EMP-02', 9, 'Electrical Engineering', 'Professor'),
('EMP-03', 10, 'Business Studies', 'Lecturer'),
('EMP-04', 23, 'Mathematics', 'Associate Professor'),
('EMP-05', 24, 'Humanities', 'Assistant Professor');

-- =====================================================================
-- DRIVERS
-- =====================================================================
INSERT INTO DRIVER (driver_id, User_ID, license_number, license_expiry, hire_date, emergency_contact, salary, driver_status) VALUES
('DRV-01', 4, 'LIC-001', '2030-01-01', '2020-01-01', '0300-1110001', 45000, 'Active'),
('DRV-02', 11, 'LIC-002', '2029-05-12', '2021-03-15', '0300-2220002', 43000, 'Active'),
('DRV-03', 12, 'LIC-003', '2028-11-20', '2022-07-01', '0300-3320003', 42000, 'Active'),
('DRV-04', 13, 'LIC-004', '2031-08-14', '2019-11-11', '0300-4420004', 48000, 'Active'),
('DRV-05', 25, 'LIC-005', '2027-02-28', '2023-01-10', '0300-5520005', 40000, 'On Leave'),
('DRV-06', 26, 'LIC-006', '2032-04-01', '2024-05-05', '0300-6620006', 41000, 'Active');

-- =====================================================================
-- ROUTES
-- =====================================================================
INSERT INTO ROUTE (Route_ID, Start_Location, Route_Name, End_Location, Total_Distance_km, Estimated_Duration_min) VALUES
(1, 'Namal Campus', 'Campus to Mianwali City', 'Mianwali City Center', 30.00, 45),
(2, 'Namal Campus', 'Campus to North Boys Hostel', 'North Boys Hostel', 5.50, 15),
(3, 'Namal Campus', 'Campus to South Girls Hostel', 'South Girls Hostel', 4.20, 12),
(4, 'Mianwali City Center', 'City to Campus Express', 'Namal Campus', 32.00, 50),
(5, 'Kundian', 'Kundian to Campus', 'Namal Campus', 45.00, 65),
(6, 'Isa Khel', 'Isa Khel to Campus', 'Namal Campus', 55.00, 80),
(7, 'Namal Campus', 'Campus to Piplan', 'Piplan Chowk', 60.00, 90),
(8, 'Namal Campus', 'Campus to Kalabagh', 'Kalabagh Viewpoint', 40.00, 60),
(9, 'Trag', 'Trag to Campus', 'Namal Campus', 25.00, 40),
(10, 'Namal Campus', 'Campus to Chashma Colony', 'Chashma Colony', 35.00, 50),
(11, 'Rokhri', 'Rokhri to Campus', 'Namal Campus', 20.00, 30),
(12, 'Namal Campus', 'Campus to Dawood Khel', 'Dawood Khel City', 28.00, 40),
(13, 'Musakhel', 'Musakhel to Campus', 'Namal Campus', 50.00, 75),
(14, 'Namal Campus', 'Campus to Wan Bhachran', 'Wan Bhachran Terminal', 38.00, 55),
(15, 'Mianwali Cantt', 'Cantt to Campus', 'Namal Campus', 33.00, 45);

-- =====================================================================
-- STOPS
-- =====================================================================
INSERT INTO STOP (Stop_ID, Stop_Name, Sequence_Number, Arrival_Offset_min) VALUES
(1, 'Campus Main Terminal', 1, 0),
(2, 'Hostel Chowk', 2, 5),
(3, 'Highway Junction', 3, 15),
(4, 'City Entrance Gate', 4, 35),
(5, 'Central Bus Stand', 5, 45),
(6, 'North Wing Lounge', 1, 0),
(7, 'Link Road Stop', 2, 8),
(8, 'Girls Residency Stop', 1, 0),
(9, 'Kundian Station', 1, 0),
(10, 'Isa Khel Bazaar', 1, 0),
(11, 'Piplan Station Stand', 1, 0),
(12, 'Kalabagh Bridge East', 1, 0),
(13, 'Chashma Right Bank Stop', 4, 30),
(14, 'Wan Bhachran Station', 4, 40),
(15, 'Cantt Gate 1', 1, 0),
(16, 'Mianwali Bypass', 3, 20),
(17, 'University Road Junction', 2, 10),
(18, 'Trag Village Center', 1, 0),
(19, 'Dawood Khel Square', 2, 25),
(20, 'Rokhri Crossing', 2, 12);

-- =====================================================================
-- ROUTE_STOP
-- =====================================================================
INSERT INTO ROUTE_STOP (Route_ID, Stop_ID, Sequence_Number, Arrival_Offset_min) VALUES
(1, 1, 1, 0), (1, 2, 2, 5), (1, 3, 3, 15), (1, 4, 4, 35), (1, 5, 5, 45),
(2, 6, 1, 0), (2, 7, 2, 8),
(3, 8, 1, 0),
(4, 16, 3, 20),
(5, 9, 1, 0),
(6, 10, 1, 0),
(7, 11, 1, 0),
(8, 12, 1, 0),
(9, 18, 1, 0),
(10, 13, 4, 30),
(11, 20, 2, 12),
(12, 19, 2, 25),
(14, 14, 4, 40),
(15, 15, 1, 0),
(15, 17, 2, 10);

-- =====================================================================
-- VEHICLES
-- =====================================================================
INSERT INTO VEHICLE (Vehicle_ID, Registration_Plate, Seating_Capacity, Make_Model, Operational_Status, GPS_Device_ID) VALUES
(1, 'MWM-A101', 50, 'Hino Bus 2024', 'Active', 'GPS-01'),
(2, 'MWM-B102', 50, 'Hino Bus 2024', 'Active', 'GPS-02'),
(3, 'MWM-C103', 29, 'Toyota Coaster', 'Active', 'GPS-03'),
(4, 'MWM-D104', 29, 'Toyota Coaster', 'Active', 'GPS-04'),
(5, 'MWM-E105', 15, 'Hiace Van', 'Under Maintenance', 'GPS-05'),
(6, 'MWM-F106', 50, 'Isuzu Bus', 'Active', 'GPS-06'),
(7, 'MWM-G107', 50, 'Isuzu Bus', 'Active', 'GPS-07'),
(8, 'MWM-H108', 29, 'Toyota Coaster', 'Retired', 'GPS-08'),
(9, 'MWM-I109', 15, 'Hiace Van', 'Active', 'GPS-09'),
(10, 'MWM-J110', 50, 'Hino Bus 2025', 'Active', 'GPS-10'),
(11, 'MWM-K111', 50, 'Hino Bus 2025', 'Under Maintenance', 'GPS-11'),
(12, 'MWM-L112', 29, 'Toyota Coaster', 'Active', 'GPS-12');

-- =====================================================================
-- SCHEDULES
-- =====================================================================
INSERT INTO SCHEDULE (Schedule_ID, Departure_from, Destination, Departure_Time, Days_Of_Week, Effective_From, Route_ID, Admin_ID) VALUES
(1, 'Namal Campus', 'Mianwali City Center', '08:00:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 1, 1),
(2, 'Namal Campus', 'North Boys Hostel', '08:30:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 2, 1),
(3, 'Namal Campus', 'South Girls Hostel', '08:45:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 3, 1),
(4, 'Mianwali City Center', 'Namal Campus', '07:00:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 4, 1),
(5, 'Kundian', 'Namal Campus', '06:45:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 5, 5),
(6, 'Isa Khel', 'Namal Campus', '06:30:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 6, 5),
(7, 'Namal Campus', 'Piplan Chowk', '17:15:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 7, 1),
(8, 'Namal Campus', 'Kalabagh Viewpoint', '16:00:00', 'Sat,Sun', '2026-01-01', 8, 1),
(9, 'Trag', 'Namal Campus', '07:15:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 9, 5),
(10, 'Namal Campus', 'Chashma Colony', '14:00:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 10, 1),
(11, 'Rokhri', 'Namal Campus', '07:30:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 11, 1),
(12, 'Namal Campus', 'Dawood Khel City', '17:30:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 12, 1),
(13, 'Musakhel', 'Namal Campus', '07:00:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 13, 5),
(14, 'Namal Campus', 'Wan Bhachran Terminal', '16:30:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 14, 1),
(15, 'Mianwali Cantt', 'Namal Campus', '07:15:00', 'Mon,Tue,Wed,Thu,Fri', '2026-01-01', 15, 1);

-- =====================================================================
-- TRIPS
-- =====================================================================
INSERT INTO TRIP (Trip_ID, Trip_Date, Trip_Status, Departure_Time, Schedule_ID, Vehicle_ID) VALUES
(1, '2026-06-10', 'Completed', '2026-06-10 08:01:00', 1, 1),
(2, '2026-06-10', 'Completed', '2026-06-10 08:30:00', 2, 3),
(3, '2026-06-10', 'Completed', '2026-06-10 08:44:00', 3, 4),
(4, '2026-06-13', 'In Progress', '2026-06-13 07:00:12', 4, 2),
(5, '2026-06-13', 'In Progress', '2026-06-13 06:48:00', 5, 6),
(6, '2026-06-13', 'Scheduled', NULL, 6, 7),
(7, '2026-06-13', 'Scheduled', NULL, 7, 1),
(8, '2026-06-14', 'Scheduled', NULL, 8, 12),
(9, '2026-06-13', 'Scheduled', NULL, 9, 9),
(10, '2026-06-13', 'Scheduled', NULL, 10, 10),
(11, '2026-06-13', 'Scheduled', NULL, 11, 2),
(12, '2026-06-13', 'Scheduled', NULL, 12, 1),
(13, '2026-06-13', 'Scheduled', NULL, 13, 6),
(14, '2026-06-13', 'Scheduled', NULL, 14, 7),
(15, '2026-06-13', 'Scheduled', NULL, 15, 9),
(16, '2026-06-12', 'Completed', '2026-06-12 08:00:00', 1, 1),
(17, '2026-06-12', 'Completed', '2026-06-12 06:45:00', 5, 6),
(18, '2026-06-11', 'Cancelled', NULL, 7, 1);

-- =====================================================================
-- VEHICLE MAINTENANCE
-- =====================================================================
INSERT INTO VEHICLE_MAINTENANCE (maintenance_id, maintenance_type, description, maintenance_date, maintenance_cost, Vehicle_ID) VALUES
(1, 'Routine Engine Oil', 'Replaced oil, air filter and fuel separator.', '2026-05-10', 15000.00, 1),
(2, 'Brake Shoe Replacement', 'Fitted original rear axle brake shoes.', '2026-05-12', 8500.00, 2),
(3, 'Tyre Replacement Set', 'Fitted 4 premium new radial tyres.', '2026-05-15', 120000.00, 3),
(4, 'AC Compressor Service', 'Gas recharge and seal restoration.', '2026-05-18', 22000.00, 4),
(5, 'Suspension Overhaul', 'Replaced leaf springs and front dampers.', '2026-05-20', 45000.00, 5),
(6, 'Battery Replacement', 'Installed new heavy-duty battery.', '2026-05-22', 18000.00, 6),
(7, 'Wiper Motor Fix', 'Re-wired relay circuit, replaced blades.', '2026-05-25', 4500.00, 7),
(8, 'Radiator Flush', 'Cleaned scaling, added coolant.', '2026-05-28', 6000.00, 8),
(9, 'Transmission Adjustment', 'Clutch plate replacement.', '2026-06-01', 35000.00, 9),
(10, 'Wheel Alignment', 'Laser balancing and calibration.', '2026-06-03', 3500.00, 11);

-- =====================================================================
-- DRIVER-VEHICLE ASSIGNMENTS
-- =====================================================================
INSERT INTO DRIVER_VE_ASSIGNMENT (Assignment_id, Driver_id, Vehicle_id, assigned_from, Assigned_by, Assignment_status) VALUES
(1, 'DRV-01', 1, '2026-01-01 07:00:00', 1, 'Active'),
(2, 'DRV-02', 2, '2026-01-01 07:00:00', 1, 'Active'),
(3, 'DRV-03', 3, '2026-01-01 07:00:00', 1, 'Active'),
(4, 'DRV-04', 4, '2026-01-01 07:00:00', 1, 'Active'),
(5, 'DRV-06', 6, '2026-01-01 07:00:00', 1, 'Active'),
(6, 'DRV-01', 7, '2026-01-01 07:00:00', 5, 'Active'),
(7, 'DRV-02', 9, '2026-01-01 07:00:00', 5, 'Active'),
(8, 'DRV-03', 10, '2026-01-01 07:00:00', 5, 'Active'),
(9, 'DRV-04', 12, '2026-01-01 07:00:00', 27, 'Active');

-- =====================================================================
-- BOOKING (Special Trip Requests by Faculty)
-- =====================================================================
INSERT INTO BOOKING (Booking_ID, Destination, Trip_Date, Departure_Time, Purpose, Passenger_Count, Status, Admin_Comments, employee_id) VALUES
(1, 'HEC Islamabad', '2026-06-20', '06:00:00', 'Research Presentation Conference', 4, 'Approved', 'Approved - vehicle MWM-C103 assigned', 'EMP-01'),
(2, 'Sargodha Board Office', '2026-06-22', '08:00:00', 'Inter-Collegiate Registration Meeting', 3, 'Pending', NULL, 'EMP-02'),
(3, 'PEF Office Faisalabad', '2026-06-25', '07:00:00', 'Strategic Training Workshop', 5, 'Pending', NULL, 'EMP-03'),
(4, 'UET Lahore Tech Hub', '2026-06-28', '04:00:00', 'Robotics Innovation Joint Expo', 6, 'Approved', 'Approved - bus arranged', 'EMP-04'),
(5, 'NUST Islamabad', '2026-07-02', '06:00:00', 'Deans Committee Academic Forum', 2, 'Rejected', 'Rejected - clashes with exam schedule', 'EMP-05'),
(6, 'Quaid-e-Azam Univ Islamabad', '2026-07-05', '06:00:00', 'Advanced Mathematics Seminar', 3, 'Pending', NULL, 'EMP-01');

-- =====================================================================
-- BOOKING_PASSENGER (names + designation per passenger on each request)
-- =====================================================================
INSERT INTO BOOKING_PASSENGER (Booking_ID, Passenger_Name, Designation) VALUES
-- Booking 1 (4 passengers)
(1, 'Najia Nayab', 'Assistant Professor'),
(1, 'Ali Raza', 'Lab Engineer'),
(1, 'Sana Tariq', 'Research Assistant'),
(1, 'Bilal Ahmed', 'Teaching Assistant'),
-- Booking 2 (3 passengers)
(2, 'Dr. Tariq Mahmood', 'Professor'),
(2, 'Hassan Ali', 'Admin Officer'),
(2, 'Mariam Yousaf', 'Coordinator'),
-- Booking 3 (5 passengers)
(3, 'Dr. Aisha Rehman', 'Lecturer'),
(3, 'Omar Farooq', 'Lab Assistant'),
(3, 'Iqra Batool', 'Research Officer'),
(3, 'Tahir Mehmood', 'Technician'),
(3, 'Sundas Naz', 'Administrative Staff'),
-- Booking 4 (6 passengers)
(4, 'Dr. Faisal Iqbal', 'Associate Professor'),
(4, 'Hamid Raza', 'Robotics Team Lead'),
(4, 'Zoya Sheikh', 'Student Representative'),
(4, 'Asad Khan', 'Student Representative'),
(4, 'Noman Sajid', 'Student Representative'),
(4, 'Komal Aslam', 'Student Representative'),
-- Booking 5 (2 passengers)
(5, 'Dr. Hina Shaukat', 'Assistant Professor'),
(5, 'Waleed Anjum', 'Research Assistant'),
-- Booking 6 (3 passengers)
(6, 'Najia Nayab', 'Assistant Professor'),
(6, 'Saad Aziz', 'Graduate Assistant'),
(6, 'Mahnoor Ijaz', 'Lab Coordinator');

-- =====================================================================
-- GPS LOGS (recent positions, simulating a route)
-- =====================================================================
INSERT INTO GPS (Timestamp, Latitude, Longitude, Speed_kmph, Vehicle_ID) VALUES
('2026-06-13 07:00:00', 32.6510, 71.4810, 0, 2),
('2026-06-13 07:05:00', 32.6540, 71.4845, 35, 2),
('2026-06-13 07:10:00', 32.6580, 71.4882, 48, 2),
('2026-06-13 07:15:00', 32.6620, 71.4920, 52, 2),
('2026-06-13 07:20:00', 32.6660, 71.4960, 45, 2),
('2026-06-13 06:48:00', 32.5401, 71.3200, 0, 6),
('2026-06-13 06:53:00', 32.5445, 71.3250, 40, 6),
('2026-06-13 06:58:00', 32.5482, 71.3301, 50, 6),
('2026-06-13 07:03:00', 32.5520, 71.3350, 47, 6),
('2026-06-13 07:08:00', 32.5560, 71.3400, 38, 6);

-- =====================================================================
-- Sample housekeeping operations
-- =====================================================================
UPDATE VEHICLE
SET Operational_Status = 'Under Maintenance'
WHERE Vehicle_ID = 11;

DELETE FROM GPS
WHERE Timestamp < '2026-05-01 00:00:00';
