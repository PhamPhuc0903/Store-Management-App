import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text('StoreManagementApp'),
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: <Widget>[
            Text(
              'Monorepo Foundation',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Quản lý cửa hàng ngay trên điện thoại',
              style: Theme.of(
                context,
              ).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 12),
            Text(
              'Flutter client đã có Riverpod, go_router và nền tảng cho Drift/SQLite. Authentication và tenancy sẽ được triển khai trong vertical slice tiếp theo.',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 28),
            const _FoundationCard(
              icon: Icons.cloud_off_outlined,
              title: 'Offline-first',
              description: 'Thiết kế sẵn cho local database và outbox.',
            ),
            const SizedBox(height: 12),
            const _FoundationCard(
              description: 'Một tài khoản có thể tham gia nhiều cửa hàng.',
              icon: Icons.storefront_outlined,
              title: 'Multi-tenant',
            ),
            const SizedBox(height: 12),
            const _FoundationCard(
              description: 'Realtime báo thay đổi, delta sync bảo đảm đầy đủ.',
              icon: Icons.sync_outlined,
              title: 'Revision sync',
            ),
          ],
        ),
      ),
    );
  }
}

class _FoundationCard extends StatelessWidget {
  const _FoundationCard({
    required this.description,
    required this.icon,
    required this.title,
  });

  final String description;
  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Icon(icon, size: 28),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(description),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
