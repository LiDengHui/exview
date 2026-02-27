# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Schema form condition DSL: `visibleWhen` / `disabledWhen` / `requiredWhen`
- Field registry with default props/rules/capabilities
- Schema debug panel (model/dependency/link traces)
- Nested group constraints: `minItems/maxItems`, `minFields/maxFields`, `itemDefault`
- Schema migration pipeline with `schemaVersion`
- Release precheck script + guide

### Changed
- SchemaForm actions fully driven by external `SchemaToolbar`
- Package build pipeline prepared for npm publish

### Fixed
- Focus first invalid field after submit validation failure

## [0.1.0] - Initial public beta baseline
- Schema form/table core capabilities
