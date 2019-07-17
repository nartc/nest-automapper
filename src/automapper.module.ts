import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { Mapper } from 'automapper-nartc';
import { AutomapperModuleOptions } from './interfaces';

export const AUTOMAPPER = 'nestjs_AUTO_MAPPER';

@Global()
@Module({})
export class AutomapperModule {
  static forRoot(options: AutomapperModuleOptions): DynamicModule {
    if (!options.configFn && !options.profiles) {
      Logger.error('AutomapperModuleOptions cannot be emptied');
      throw new Error('AutomapperModuleOptions cannot be emptied');
    }

    if (options.profiles && options.configFn) {
      Logger.warn(
        'AutomapperModuleOptions ConfigFn will override AutomapperModuleOptions Profiles'
      );
      Mapper.initialize(options.configFn);
    } else if (options.profiles && !options.configFn) {
      Mapper.initialize(config => {
        for (let i = 0; i < options.profiles.length; i++) {
          config.addProfile(options.profiles[i]);
        }
      });
    } else if (options.configFn && !options.profiles) {
      Mapper.initialize(options.configFn);
    }

    return {
      module: AutomapperModule,
      providers: [{ provide: AUTOMAPPER, useValue: Mapper }],
      exports: [{ provide: AUTOMAPPER, useValue: Mapper }]
    };
  }
}
