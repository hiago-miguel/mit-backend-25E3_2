import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../Domain/index';

export class EmployeeRepository {
  private static instance: EmployeeRepository;
  private employees: Employee[] = [];

  private constructor() {}

  public static getInstance(): EmployeeRepository {
    if (!EmployeeRepository.instance) {
      EmployeeRepository.instance = new EmployeeRepository();
    }
    return EmployeeRepository.instance;
  }

  async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    const employee: Employee = {
      id: this.generateId(),
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.employees.push(employee);
    return employee;
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employees.find(employee => employee.id === id) || null;
  }

  async findAll(): Promise<Employee[]> {
    return [...this.employees];
  }

  async update(id: string, updates: UpdateEmployeeRequest): Promise<Employee | null> {
    const employeeIndex = this.employees.findIndex(employee => employee.id === id);
    if (employeeIndex === -1) return null;

    this.employees[employeeIndex] = {
      ...this.employees[employeeIndex],
      ...updates,
      updatedAt: new Date()
    };

    return this.employees[employeeIndex];
  }

  async delete(id: string): Promise<boolean> {
    const employeeIndex = this.employees.findIndex(employee => employee.id === id);
    if (employeeIndex === -1) return false;

    this.employees.splice(employeeIndex, 1);
    return true;
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  // Método para testes - limpa todos os empregados
  clearTestData(): void {
    this.employees = [];
  }
}
