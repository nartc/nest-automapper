const AUTOMAPPER = 'nestjs__AUTO_MAPPER';
export const getMapperToken = (name?: string) =>
  name ? AUTOMAPPER + name : AUTOMAPPER + 'default';
