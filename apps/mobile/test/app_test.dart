import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:store_management_app/src/app.dart';

void main() {
  testWidgets('renders foundation home screen', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: StoreManagementApp()));
    expect(find.text('StoreManagementApp'), findsOneWidget);
    expect(find.text('Offline-first'), findsOneWidget);
    expect(find.byIcon(Icons.sync_outlined), findsOneWidget);
  });
}
