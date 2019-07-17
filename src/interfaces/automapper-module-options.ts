import { MappingProfileBase, Configuration } from 'automapper-nartc';

export interface AutomapperModuleOptions {
  profiles?: Array<MappingProfileBase>;
  configFn?: (config: Configuration) => void;
}
