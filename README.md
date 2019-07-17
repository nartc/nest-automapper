<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<h1 align="center">Nest Automapper</h1>
<p align="center">A wrapper around <a href="https://github.com/nartc/automapper-nartc">automapper-nartc</a> to be used with <strong>NestJS</strong> as a <code>Module</code>.</p>

## Documentations

This module is a wrapper around `automapper-nartc` so all usage documentations should be referenced at the link below. 

Github Pages [https://nartc.github.io/automapper-nartc/](https://nartc.github.io/automapper-nartc/)

## Setup
```
npm i -s nest-automapper
```

**Note**: Installing `nest-automapper` will also install `automapper-nartc` because it is a `dependency` of this wrapper.

**Note 2**: Please make sure that you've read `automapper-nartc` documentations to familiarize yourself with `AutoMapper`'s terminology and how to setup your `Profile` and such.

1. Import `AutomapperModule` in `AppModule`

```typescript
@Module({
  imports: [AutomapperModule.forRoot({profiles: [new UserProfile()]})]
})
export class AppModule {}
```
 
`AutomapperModule.forRoot()` method expects an `AutomapperModuleOptions`. There are two properties on the options that you can pass in:
- `profiles`: An array of `MappingProfileBase`.
- `configFn`: A configuration function that will get called automatically.

This module will require you to pass at least one of the properties. If you pass both properties, `configFn` will take precedence over `profiles`.

`AutomapperModule` provides an injectable-singleton of an instance of `AutoMapper` in `automapper-nartc`

2. Inject `Mapper` in your `Service`:

```typescript
export class UserService {
  constructor(@InjectMapper() private readonly _mapper: AutoMapper) {}
}
```

**Note**: `AutoMapper` is imported from `automapper-nartc`. `InjectMapper` decorator is imported from `nest-automapper`.

3. Use `Mapper` on your domain models:

```typescript
...
const result = await newUser.save();
return this._mapper.map(result.toJSON(), UserVm);
...
```

## Caveats

Due to reflection capabilities that `TypeScript` has, there are some caveats/opinionated problems about using this wrapper (ultimately, `automapper-nartc`).
1. `automapper-nartc` only works with `Classes`. `Interfaces` won't work because `Interfaces` will lose its context after transpiled.
2. If you use **MongoDB**, you might want (or really, need) to use `typegoose`. `Typegoose` allows you to create your domain models/schemas using `Classes` and this works well with `automapper-nartc`. If you never use `mongoose` with `typescript` before, you'd have to create your domain models as `interface` because you'd have to extend `mongoose.Document` (which is an `interface`).
3. In your `DTOs`/`ViewModels` classes, you have to use the short-hand when you define your `fields`. This is to make sure the instance of the `DTO`/`ViewModel` being mapped will have all the properties needed, even though they are undefined, when it gets mapped.

```typescript
// BAD
export class UserVm {
  firstName: string;
  lastName: string;
  fullName: string;
}

// GOOD
export class UserVm {
  constructor(
    public firstName: string,
    public lastName: string,
    public fullName: string
  ) {
    // if you have nested object or nested array, you might want to initialize them here.
  }
}
```
