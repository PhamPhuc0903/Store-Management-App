import 'package:go_router/go_router.dart';
import 'package:store_management_app/src/features/home/presentation/home_screen.dart';

final GoRouter appRouter = GoRouter(routes: <RouteBase>[
  GoRoute(path: '/', builder: (context, state) => const HomeScreen())],
  initialLocation: '/'
);
