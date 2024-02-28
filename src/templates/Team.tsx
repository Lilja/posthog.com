import { CallToAction } from 'components/CallToAction'
import { PineappleText } from 'components/Job/Sidebar'
import Layout from 'components/Layout'
import Link from 'components/Link'
import { InProgress } from 'components/Roadmap/InProgress'
import { Question } from 'components/Squeak'
import useTeamUpdates from 'hooks/useTeamUpdates'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { kebabCase } from 'lib/utils'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { UnderConsideration } from 'components/Roadmap/UnderConsideration'
import { Change } from './Changelog'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const SidebarSection = ({ title, children }) => {
    return (
        <div>
            <h5 className="m-0 text-[15px] opacity-50 mb-2">{title}</h5>
            <div>{children}</div>
        </div>
    )
}

const Section = ({ children, title }) => {
    return (
        <section className="max-w-screen-xl mx-auto px-5 my-12">
            {title && <h4>{title}</h4>}
            <div>{children}</div>
        </section>
    )
}

export default function Team({
    data: {
        team: { crest, name, description, profiles, roadmaps },
        objectives,
    },
}) {
    const teamName = `${name} Team`
    const teamLength = profiles?.data?.length
    const pineapplePercentage =
        teamLength &&
        teamLength > 0 &&
        Math.round(
            (profiles?.data?.filter(({ attributes: { pineappleOnPizza } }) => pineappleOnPizza).length / teamLength) *
                100
        )

    const underConsideration = roadmaps.filter(
        (roadmap) =>
            !roadmap.dateCompleted &&
            !roadmap.projectedCompletion &&
            roadmap.githubPages &&
            roadmap.githubPages.length > 0
    )

    const inProgress = roadmaps.filter((roadmap) => !roadmap.complete && roadmap.projectedCompletion)

    const [recentlyShipped] = roadmaps
        .filter((roadmap) => roadmap.complete)
        .sort((a, b) => (new Date(a.dateCompleted).getTime() > new Date(b.dateCompleted).getTime() ? -1 : 1))

    const { updates } = useTeamUpdates({
        teamName: name,
        filters: {
            roadmap: {
                id: {
                    $null: true,
                },
            },
        },
    })

    return (
        <Layout>
            <Section>
                <div className="flex flex-col md:flex-row space-x-4 items-center">
                    <GatsbyImage image={getImage(crest)} alt={teamName} />
                    <div className="max-w-xl">
                        <h1 className="m-0">{teamName}</h1>
                        <p className="my-4 text-[15px]" dangerouslySetInnerHTML={{ __html: description }} />

                        <CallToAction type="secondary" size="md">
                            See what we're building
                        </CallToAction>
                    </div>
                    <figure className="rotate-2 w-72 flex flex-col gap-2 mt-8 md:mt-0">
                        <div className="bg-accent aspect-video rounded-md flex justify-center items-center">image</div>
                        <div className="text-right text-sm">Caption</div>
                    </figure>
                </div>
            </Section>
            <Section title="People">
                <div className="flex space-x-12">
                    <ul className="flex-1 list-none p-0 m-0 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {profiles.data.map(
                            ({
                                id,
                                attributes: { avatar, firstName, lastName, country, companyRole, location, ...other },
                            }) => {
                                const name = [firstName, lastName].filter(Boolean).join(' ')
                                return (
                                    <li key={id} className="bg-border rounded-md">
                                        <Link
                                            to={`/community/profiles/${id}`}
                                            className="border border-border rounded-md h-full bg-accent flex flex-col p-4 relative hover:-top-0.5 active:top-[.5px] hover:transition-all z-10 overflow-hidden max-h-64"
                                        >
                                            <div className="mb-auto">
                                                <h3
                                                    className="mb-0 text-lg leading-tight"
                                                    id={kebabCase(name) + '-' + kebabCase(companyRole)}
                                                >
                                                    {name}
                                                </h3>
                                                <p className="text-primary/50 text-sm dark:text-primary-dark/50 m-0">
                                                    {companyRole}
                                                </p>

                                                <div className="mt-2">
                                                    {country === 'world' ? (
                                                        '🌎'
                                                    ) : (
                                                        <ReactCountryFlag
                                                            className="!w-7 !h-7"
                                                            svg
                                                            countryCode={country}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-auto -mb-4 -mr-4 mt-2">
                                                <img
                                                    src={
                                                        avatar?.data?.attributes?.url ||
                                                        'https://res.cloudinary.com/dmukukwp6/image/upload/v1698231117/max_6942263bd1.png'
                                                    }
                                                    className="w-[165px]"
                                                />
                                            </div>
                                        </Link>
                                    </li>
                                )
                            }
                        )}
                    </ul>
                    <div className="w-full md:max-w-sm shrink-1 basis-sm">
                        <SidebarSection title="Small team FAQ">
                            <p className="font-bold m-0">Q: Does pineapple belong on pizza?</p>
                            <p className="font-bold m-0 mt-2">{PineappleText(pineapplePercentage)}</p>
                        </SidebarSection>
                    </div>
                </div>
            </Section>
            {inProgress.length > 0 && (
                <Section title="What we're building">
                    <div className="flex space-x-12 items-start">
                        <ul className="list-none m-0 p-0 grid grid-cols-2 gap-4">
                            {inProgress.map((roadmap) => (
                                <InProgress key={roadmap.squeakId} {...roadmap} />
                            ))}
                        </ul>
                        {updates.length > 0 && (
                            <div className="max-w-[340px] w-full flex-shrink-0">
                                <SidebarSection title="Latest update">
                                    <Question key={updates[0].question} id={updates[0].question} />
                                </SidebarSection>
                            </div>
                        )}
                    </div>
                </Section>
            )}
            {underConsideration.length > 0 && (
                <Section title="Roadmap">
                    <p className="-mt-2">
                        Here’s what we’re considering building next. Vote for your favorites or share a new idea on{' '}
                        <Link to="https://github.com/PostHog/posthog">GitHub</Link>.
                    </p>
                    <div>
                        <ul className="list-none m-0 p-0 space-y-4">
                            {underConsideration.map((roadmap) => (
                                <UnderConsideration key={roadmap.squeakId} {...roadmap} />
                            ))}
                        </ul>
                    </div>
                </Section>
            )}
            {recentlyShipped && (
                <Section title="Recently shipped">
                    <div className="max-w-2xl">
                        <Change {...recentlyShipped} />
                    </div>
                </Section>
            )}
            {objectives?.body && (
                <Section title="Goals">
                    <div className="article-content">
                        <MDXProvider components={{}}>
                            <MDXRenderer>{objectives.body}</MDXRenderer>
                        </MDXProvider>
                    </div>
                </Section>
            )}
        </Layout>
    )
}

export const query = graphql`
    query TeamTemplateQuery($id: String!, $teamName: String!, $objectives: String) {
        body: mdx(id: { eq: $id }) {
            frontmatter {
                title
            }
        }
        team: squeakTeam(name: { eq: $teamName }) {
            name
            description
            crest {
                gatsbyImageData(width: 227)
            }
            roadmaps {
                squeakId
                betaAvailable
                complete
                dateCompleted
                title
                description
                media {
                    gatsbyImageData
                    publicId
                    data {
                        attributes {
                            mime
                        }
                    }
                }
                githubPages {
                    title
                    html_url
                    number
                    closed_at
                    reactions {
                        hooray
                        heart
                        eyes
                        plus1
                    }
                }
                projectedCompletion
                cta {
                    label
                    url
                }
            }
            profiles {
                data {
                    id
                    attributes {
                        avatar {
                            data {
                                attributes {
                                    url
                                }
                            }
                        }
                        lastName
                        firstName
                        companyRole
                        country
                        location
                        pineappleOnPizza
                    }
                }
            }
        }
        objectives: mdx(fields: { slug: { eq: $objectives } }) {
            body
        }
    }
`
