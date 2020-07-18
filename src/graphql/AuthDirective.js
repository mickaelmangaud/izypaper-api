import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    /* Extract directive argument */
    const requiredRole = this.args.requires;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function(...args) {
      const context = args[2];
      
      const isAuthorized = context.user && context.user.roles.find(role => role === requiredRole);
      if (!isAuthorized) {
        throw new AuthenticationError(`You need following role: ${requiredRole}`);
      }
      
      return originalResolve.apply(this, args);
    }
  }
}

export default AuthDirective;