<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<h1 align="center">Nest Automapper</h1>
<p align="center">A wrapper around <a href="https://github.com/nartc/automapper-nartc">automapper-nartc</a> to be used with <strong>NestJS</strong> as a <code>Module</code>.</p>

## Documentations

This module is a wrapper around `@nartc/automapper` so all usage documentations should be referenced at the link below. 

Github Pages [https://nartc.github.io/mapper/](https://nartc.github.io/mapper/)
Github Repo [https://github.com/nartc/mapper](https://github.com/nartc/mapper)

## Setup
```
npm i -s nest-automapper
```

**Note 1**: Please make sure that you've read `@nartc/automapper` documentations to familiarize yourself with `AutoMapper`'s terminology and how to setup your `Profile` and such.

1. Import `AutomapperModule` in `AppModule` and call `.forRoot()` method.

```typescript
@Module({
  imports: [AutomapperModule.forRoot()]
})
export class AppModule {}
```
 
`AutomapperModule.forRoot()` method expects an `AutomapperModuleRootOptions`. When you call `AutomapperModule.forRoot()`, a new instance of `AutoMapper` will be created with the `name` option. There are two properties on the options that you can pass in:
- `name`: Name of this `AutoMapper` instance. Default to `"default"`.
- `config`: A configuration function that will get called automatically.

Both options are optional. If you pass in `config` and configure your `AutoMapper` there, that is totally fine, but the following approach is recommended. Refer to [@nartc/automapper: usage](https://github.com/nartc/mapper#usage) 

2. `AutoMapper` has a concept of `Profile`. A `Profile` is a class that will house some specific mappings related to a specific domain model. Eg: `User` mappings will be housed by `UserProfile`. Refer to [@nartc/automapper: usage](https://github.com/nartc/mapper#usage) for more information regarding `Profile`.

`NestJS` recommends you to separate features/domains in your application into `Modules`, in each module you would import/declare other modules/parts that are related to that Module. `AutomapperModule` also has a static method `forFeature` which should be used in such a feature module. `forFeature` accepts an `AutomapperModuleFeatureOptions` which has:
- `profiles`: An array of `Profiles` related to this module, and this will be added to an `AutoMapper` instance.
- `name`: Decide which `AutoMapper` instance to add these profiles to. Default to `"default"`

```typescript 
@Module({
  imports: [AutomapperModule.forFeature({profiles: [new UserProfile()]})]
})
export class UserModule {}
```

#### Exceptions:
- `AutomapperModule` will throw an `Exception` if `forFeature` receives an empty option
- `AutomapperModule` will throw an `Exception` if `forFeature` is called before any `forRoot()` calls.

3. Inject an instance of `AutoMapper` in your `Service`:

```typescript
export class UserService {
  constructor(@InjectMapper() private readonly _mapper: AutoMapper) {}
}
```

**Note**: `AutoMapper` is imported from `@nartc/automapper`. `InjectMapper` decorator is imported from `nest-automapper`.

`InjectMapper()` accepts an optional argument `name` which will tell the decorator to inject the right instance of `AutoMapper`. Default to `"default"`.

3. Use `AutoMapper` on your domain models:

```typescript
...
const result = await newUser.save();
return this._mapper.map(result.toJSON(), UserVm);
...
```

## Caveats

Due to reflection capabilities that `TypeScript` has, there are some caveats/opinionated problems about using this wrapper (ultimately, `@nartc/automapper`).
1. `@nartc/automapper` only works with `Classes`. `Interfaces` won't work because `Interfaces` will lose its context after transpiled.
2. Please follow `@nartc/automapper` example to understand how to setup your models.
```
