export interface IPlaceholder {
  id?: number;
  description?: string;
}

export class Placeholder implements IPlaceholder {
  constructor(public id?: number, public description?: string) {}
}

export function getPlaceholderIdentifier(placeholder: IPlaceholder): number | undefined {
  return placeholder.id;
}
