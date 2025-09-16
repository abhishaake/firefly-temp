export interface Machine {
  id: number;
  machineNo: number;
  machineName: string;
  machineType: string;
  macId: string;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
  isActive: boolean;
}

export interface CreateMachineRequest {
  machineNo: number;
  machineName: string;
  machineType: string;
  macId: string;
  locationId: number;
}

export interface UpdateMachineRequest extends CreateMachineRequest {
  id: number;
}

export interface MachinesResponseData {
  machines: Machine[];
}

export interface MachinesApiResponse {
  data: MachinesResponseData;
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
}

export interface MachineApiResponse {
    data: Machine;
    success: boolean;
    statusCode: number;
    message: string;
    displayMessage: string;
}

export interface MachineDeleteApiResponse {
  data: string;
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
}


export interface LocationsResponseData {
  locations: Location[];
}

export interface LocationsApiResponse {
  data: LocationsResponseData;
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
} 