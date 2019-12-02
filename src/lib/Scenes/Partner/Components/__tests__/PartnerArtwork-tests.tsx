import { Theme } from "@artsy/palette"
import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import { Artwork as GridItem } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { StickyTabScrollViewContext } from "lib/Components/StickyTabPage/StickyTabScrollView"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { ScrollView } from "react-native"
import Animated from "react-native-reanimated"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerArtworkFixture } from "../__fixtures__/PartnerArtwork-fixture"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "../PartnerArtwork"

jest.unmock("react-relay")

describe("PartnerArtwork", () => {
  const getWrapper = async (partner: Omit<PartnerArtwork_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <StickyTabScrollViewContext.Provider
              value={{
                contentHeight: new Animated.Value(0),
                layoutHeight: new Animated.Value(0),
                scrollOffsetY: new Animated.Value(0),
              }}
            >
              <PartnerArtwork partner={{ ...partner }} relay={{ environment: {} } as RelayPaginationProp} {...props} />
            </StickyTabScrollViewContext.Provider>
          </Theme>
        )
      },
      query: graphql`
        query PartnerArtworkTestsQuery @raw_response_type {
          partner(id: "anderson-fine-art-gallery-flickinger-collection") {
            id
            artworks: artworksConnection(first: 10) {
              edges {
                node {
                  id
                }
              }
              ...InfiniteScrollArtworksGrid_connection
            }
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the artworks", async () => {
    const wrapper = await getWrapper(PartnerArtworkFixture as any)
    wrapper
      .find(ScrollView)
      .props()
      .onLayout({
        nativeEvent: {
          layout: { width: 768 },
        },
      })
    await flushPromiseQueue()
    wrapper.update()
    expect(wrapper.find(GridItem).length).toBe(10)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
