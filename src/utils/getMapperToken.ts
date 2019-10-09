const AUTOMAPPER = 'nestjs__AUTO_MAPPER';
export const getMapperToken = (name?: string) =>
  name ? Symbol.for(AUTOMAPPER + name) : Symbol.for(AUTOMAPPER + 'default');
