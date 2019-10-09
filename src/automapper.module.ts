import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { AutoMapper } from 'automapper-nartc';
import {
  AutomapperModuleFeatureOptions,
  AutomapperModuleRootOptions
} from './interfaces';
import { getMapperToken } from './utils/getMapperToken';

@Global()
@Module({})
export class AutomapperModule {
  private static readonly logger: Logger = new Logger('AutomapperModule');

  /**
   * Initialize an AutoMapper instance with a name. Default to "default"
   *
   * Generally, `forRoot` only needs to be ran once to provide a singleton for the whole application
   *
   * @param {AutomapperModuleRootOptions} options
   */
  static forRoot(options: AutomapperModuleRootOptions): DynamicModule {
    if (!options.configFn) {
      const message = 'AutomapperModuleRootOptions.configFn is empty';
      this.logger.error(message);
      throw new Error(message);
    }

    const mapper = new AutoMapper();
    mapper.initialize(options.configFn);

    return {
      module: AutomapperModule,
      providers: [{ provide: getMapperToken(options.name), useValue: mapper }],
      exports: [{ provide: getMapperToken(options.name), useValue: mapper }]
    };
  }

  /**
   * Add to the AutoMapper instance a list of MappingProfiles. By default, the instance with name "default" will be used.
   *
   * @param {AutomapperModuleFeatureOptions} options
   */
  static forFeature(options: AutomapperModuleFeatureOptions): DynamicModule {
    if (!options || (options && !options.profiles)) {
      const message = 'AutomapperModuleFeatureOptions.profiles is empty';
      this.logger.error(message);
      throw new Error(message);
    }

    const providers = [
      {
        provide: getMapperToken(options.name),
        useFactory: (mapper: AutoMapper) => {
          options.profiles.forEach(pf => {
            mapper.addProfile(pf);
          });
          return mapper;
        },
        inject: [getMapperToken(options.name)]
      }
    ];

    return {
      module: AutomapperModule,
      providers: providers,
      exports: providers
    };
  }
}
