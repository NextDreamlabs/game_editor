const observablePropertiesKey = Symbol('observableProperties');

export function ObservableProperty(target: any, propertyKey: string | symbol) {
  if (!target[observablePropertiesKey]) {
    target[observablePropertiesKey] = [];
  }
  target[observablePropertiesKey].push(propertyKey);
}
export function applyObservableProperties(instance: any) {
  const properties = instance.constructor.prototype[observablePropertiesKey] || [];
  const handler = {
    set(target: any, property: string | symbol, value: any) {
      if (properties.includes(property)) {
        target[property] = value;
        if (typeof instance.updateUI === 'function') {
          instance.updateUI(property.toString(), target[property]);
        }
        return true;
      }
      return Reflect.set(target, property, value);
    },
    get(target: any, property: string | symbol) {
      return target[property];
    }
  };

  const proxyInstance = new Proxy(instance, handler);

  // Copy existing properties to the proxy instance
  properties.forEach((propertyKey: string | symbol) => {
    proxyInstance[propertyKey] = instance[propertyKey];
  });

  return proxyInstance;
}