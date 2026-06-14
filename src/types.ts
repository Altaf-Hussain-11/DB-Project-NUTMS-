export type Role = 'Student' | 'Faculty' | 'Driver' | 'Administrator';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Profile {
  User_ID: number;
  Full_Name: string;
  Email: string;
  role_id: string;
  Created_At: string;
  Registration_No?: string;
  Residential_Type?: string;
  employee_id?: string;
  department?: string;
  designation?: string;
  driver_id?: string;
  license_number?: string;
  driver_status?: string;
  Admin_Level?: string;
}

export interface Schedule {
  Schedule_ID: number;
  Departure_from: string;
  Destination: string;
  Departure_Time: string;
  Days_Of_Week: string;
  Effective_From: string;
  Route_Name: string;
  Route_ID: number;
}

export interface GPSReading {
  Vehicle_ID: number;
  Registration_Plate: string;
  Latitude: number;
  Longitude: number;
  Speed_kmph: number;
  Timestamp: string;
}

export interface Vehicle {
  Vehicle_ID: number;
  Registration_Plate: string;
  Seating_Capacity: number;
  Make_Model: string;
  Operational_Status: string;
  GPS_Device_ID?: string;  // add this line
}
export interface AdminDashboardSummary {
  Total_Users: number;
  Active_Vehicles: number;
  Trips_Today: number;
  Pending_Requests: number;
}

export interface Booking {
  Booking_ID: number;
  Destination: string;
  Trip_Date: string;
  Status: string;
  Passenger_Count: number;
  Purpose: string;
  Requested_By: string;
  department?: string;        // add
  Departure_Time?: string;    // add
  Admin_Comments?: string;    // add
}

export interface Trip {
  Trip_ID: number;
  Trip_Date: string;
  Trip_Status: TripStatus;
  Departure_from: string;
  Destination: string;
  Registration_Plate: string;
  GPS_Device_ID?: string;
  Route_Name?: string;           // add
  Scheduled_Time?: string;       // add
  Seating_Capacity?: number;     // add
  Total_Distance_km?: number;    // add
  Estimated_Duration_min?: number; // add
}

export interface RouteItem {
  Route_ID: number;
  Route_Name: string;
  Start_Location: string;
  End_Location: string;
  Total_Distance_km: number;
  Estimated_Duration_min: number;
}

export interface Stop {
  Stop_ID: number;
  Stop_Name: string;
  Arrival_Offset_min: number;
}
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'danger';  // add this line
}
export interface NavLinkItem {
  to: string;
  icon: string;
  label: string;
}
export interface AdminUserRow {
  User_ID: number;
  Full_Name: string;
  Email: string;
  role_id: string;
  Registration_No?: string;
  Residential_Type?: string;
  employee_id?: string;
  department?: string;
  designation?: string;
  driver_id?: string;
  license_number?: string;
  driver_status?: string;
}
export interface Driver {
  driver_id: string;
  Full_Name: string;
  Email: string;
  license_number: string;
  license_expiry: string;
  hire_date: string;
  salary: number;
  driver_status: string;
}

export interface Assignment {
  Assignment_id: number;
  Driver_id: string;
  Driver_Name: string;
  Registration_Plate: string;
  assigned_from: string;
  assigned_to: string;
  Assignment_status: string;
  Vehicle_ID?: number;  // add this line
}
export interface RoutePerformance {
  Route_Name: string;
  Completion_Rate_Pct: number;
}

export interface DriverPerformance {
  Full_Name: string;
  Completion_Rate_Pct: number;
}

export interface VehicleUtilization {
  Vehicle_ID: number;
  Registration_Plate: string;
  Operational_Status: string;
  Total_Trips: number;
  Total_Maintenance_Cost: number;
}

export interface TripsTrendPoint {
  Trip_Date: string;
  Total_Trips: number;
  Completed: number;
  Cancelled: number;
}
export type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface BookingPassenger {
  Passenger_ID: number;
  Passenger_Name: string;
  Designation: string;
}
export type TripStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface TripStop {
  Sequence_Number: number;
  Stop_Name: string;
  Arrival_Offset_min: number;
}