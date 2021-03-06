import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { extractText } from "lib/tests/extractText"
import { mockEdges } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { mockEnvironmentPayload } from "../../../../tests/mockEnvironmentPayload"
import { AuctionResultFragmentContainer } from "../../../Lists/AuctionResult"
import { ArtistInsightsAuctionResultsPaginationContainer, SortMode } from "../ArtistInsightsAuctionResults"

jest.unmock("react-relay")

describe("ArtistInsightsAuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  let getState: () => ArtworkFilterContextState

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    getState = () => ({
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "auctionResult",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsAuctionResultsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsAuctionResultsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsightsAuctionResults_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          return (
            <ArtworkFilterContext.Provider value={{ state: getState(), dispatch: jest.fn() }}>
              <ArtistInsightsAuctionResultsPaginationContainer artist={props.artist} />
            </ArtworkFilterContext.Provider>
          )
        }
        return null
      }}
    />
  )

  it("renders list auction results when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => ({
        auctionResultsConnection: {
          edges: mockEdges(5),
        },
      }),
    })

    expect(tree.root.findAllByType(FlatList).length).toEqual(1)
    expect(tree.root.findAllByType(AuctionResultFragmentContainer).length).toEqual(5)
    expect(extractText(tree.root.findByType(SortMode))).toBe("Sorted by most recent sale date")
  })

  it("renders FilteredArtworkGridZeroState when no auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => ({
        auctionResultsConnection: {
          edges: [],
        },
      }),
    })

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState).length).toEqual(1)
  })
})
