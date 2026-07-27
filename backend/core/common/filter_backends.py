from django.db.models import Q
from rest_framework.filters import BaseFilterBackend


class DynamicFilterBackend(BaseFilterBackend):
    """
    Reusable filter backend for DRF ListAPIView/ViewSet.

    Supports:
        • Exact field filtering
        • Many-to-many filtering
        • Date range filtering

    View configuration:

        class ComplaintViewSet(ModelViewSet):
            filter_backends = [DynamicFilterBackend]

            filter_fields = [
                "status",
                "user",
            ]

            m2m_filter_fields = [
                "tags",
            ]

            date_filter_fields = [
                "created_at",
                "incident_date",
            ]

    Supported query parameters:

        Exact field:
            ?status=pending
            ?user=5

        Many-to-many (comma-separated IDs):
            ?tags=1
            ?tags=1,2,3

        Date range:
            ?created_at_after=2026-01-01
            ?created_at_before=2026-01-31
            ?created_at_after=2026-01-01&created_at_before=2026-01-31

            ?incident_date_after=2026-06-01
            ?incident_date_before=2026-06-30

    Filters can be combined:

        ?status=approved&tags=2,5&created_at_after=2026-01-01

    Notes:
        - `filter_fields` perform exact matches.
        - `m2m_filter_fields` filter by related object IDs.
        - `date_filter_fields` generate `<field>_after` (>=) and
        `<field>_before` (<=) query parameters automatically.
        - Returns `queryset.distinct()` to avoid duplicate rows when filtering
        many-to-many relationships.
    """

    def filter_queryset(self, request, queryset, view):
        filter_fields = getattr(view, "filter_fields", [])
        m2m_fields = getattr(view, "m2m_filter_fields", [])
        date_fields = getattr(view, "date_filter_fields", [])

        filters = {}

        for field in filter_fields:
            value = request.query_params.get(field)
            if value not in [None, ""]:
                filters[field] = value

        queryset = queryset.filter(**filters)

        for field in m2m_fields:
            value = request.query_params.get(field)

            if value:
                ids = [
                    int(pk)
                    for pk in value.split(",")
                    if pk.strip().isdigit()
                ]

                if ids:
                    queryset = queryset.filter(**{f"{field}__id__in": ids})

        for field in date_fields:
            after = request.query_params.get(f"{field}_after")
            before = request.query_params.get(f"{field}_before")

            if after:
                queryset = queryset.filter(**{f"{field}__gte": after})

            if before:
                queryset = queryset.filter(**{f"{field}__lte": before})

        return queryset.distinct()