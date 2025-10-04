export interface IBaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBaseEntityWithSoftDelete {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
