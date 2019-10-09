const AUTOMAPPER = 'nestjs__AUTO_MAPPER';
export const getMapperToken = (name?: string) =>
  name ? Symbol(AUTOMAPPER + name) : Symbol(AUTOMAPPER + 'default');
