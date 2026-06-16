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
  role_id: Role;
  Profile_Photo: string | null;
  Created_At: string;
  Registration_No?: string | null;
  Residential_Type?: 'Hosteler' | 'Day Scholar' | null;
  employee_id?: string | null;
  department?: string | null;
  designation?: string | null;
  driver_id?: string | null;
  license_number?: string | null;
  license_expiry?: string | null;
  driver_status?: 'Active' | 'On Leave' | 'Terminated' | null;
  Admin_Level?: 'Super Admin' | 'Regular Admin' | null;
}

export interface RouteItem {
  Route_ID: number;
  Start_Location: string;
  Route_Name: string;
  End_Location: string;
  Total_Distance_km: number;
  Estimated_Duration_min: number;
}

export interface Stop {
  Route_ID: number;
  Stop_ID: number;
  Stop_Name: string;
  Sequence_Number: number;
  Arrival_Offset_min: number;
}

export interface Schedule {
  Schedule_ID: number;
  Departure_from: string;
  Destination: string;
  Departure_Time: string;
  Days_Of_Week: string;
  Effective_From: string;
  Effective_Until: string | null;
  Route_ID: number;
  Route_Name: string;
  Admin_ID: number;
}

export interface Vehicle {
  Vehicle_ID: number;
  Registration_Plate: string;
  Seating_Capacity: number;
  Make_Model: string;
  Operational_Status: 'Active' | 'Under Maintenance' | 'Retired';
  GPS_Device_ID: string | null;
}

export type TripStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Trip {
  Trip_ID: number;
  Trip_Date: string;
  Trip_Status: TripStatus;
  Departure_Time: string | null;
  Schedule_ID?: number;
  Departure_from: string;
  Destination: string;
  Scheduled_Time: string;
  Route_Name: string;
  Vehicle_ID?: number;
  Registration_Plate: string;
  GPS_Device_ID?: string | null;
  Total_Distance_km?: number;
  Estimated_Duration_min?: number;
  Seating_Capacity?: number;
}

export interface TripStop {
  Stop_Name: string;
  Sequence_Number: number;
  Arrival_Offset_min: number;
}

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Booking {
  Booking_ID: number;
  Destination: string;
  Trip_Date: string;
  Departure_Time: string;
  Purpose: string;
  Passenger_Count: number;
  Status: BookingStatus;
  Admin_Comments: string | null;
  Requested_At: string;
  Resolved_At: string | null;
  employee_id?: string;
  Requested_By?: string;
  department?: string;
}

export interface BookingPassenger {
  Passenger_ID: number;
  Passenger_Name: string;
  Designation: string;
}

export interface GPSReading {
  Vehicle_ID: number;
  Registration_Plate: string;
  GPS_Device_ID: string | null;
  Latitude: number;
  Longitude: number;
  Speed_kmph: number | null;
  Timestamp: string;
}

export interface Driver {
  driver_id: string;
  User_ID: number;
  Full_Name: string;
  Email: string;
  license_number: string;
  license_expiry: string;
  hire_date: string;
  emergency_contact: string;
  salary: number;
  driver_status: 'Active' | 'On Leave' | 'Terminated';
}

export interface Assignment {
  Assignment_id: number;
  Driver_id: string;
  Driver_Name: string;
  Vehicle_ID: number;
  Registration_Plate: string;
  assigned_from: string;
  assigned_to: string | null;
  Assignment_status: 'Active' | 'Completed' | 'Cancelled';
}

export interface AdminUserRow {
  User_ID: number;
  Full_Name: string;
  Email: string;
  role_id: Role;
  Created_At: string;
  Registration_No?: string | null;
  Residential_Type?: string | null;
  employee_id?: string | null;
  department?: string | null;
  designation?: string | null;
  driver_id?: string | null;
  license_number?: string | null;
  driver_status?: string | null;
}

export interface AdminDashboardSummary {
  Total_Users: number;
  Active_Vehicles: number;
  Trips_Today: number;
  Pending_Requests: number;
}

export interface RoutePerformance {
  Route_ID: number;
  Route_Name: string;
  Total_Trips: number;
  Completed_Trips: number;
  Cancelled_Trips: number;
  Completion_Rate_Pct: number;
}

export interface DriverPerformance {
  driver_id: string;
  Full_Name: string;
  Total_Trips: number;
  Completed_Trips: number;
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

/** Client-side notification (NOT persisted in DB) */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number; // epoch ms
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'danger';
}
