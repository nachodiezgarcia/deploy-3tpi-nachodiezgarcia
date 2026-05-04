export interface User {
  id: string;
  name: string;
  email: string;
  rol: 'student' | 'admin';
  isActive: boolean;
}

export interface UserDetail extends User {
  activeTrainings: Array<{
    contentIslandId: string;
    name_course: string;
  }>;
}

export interface InviteUserInput {
  name: string;
  email: string;
  rol: 'student' | 'admin';
  coursesToAssign: Array<{ contentIslandId: string; name_course: string }>;
}
