function injectTag(show) {
    const createItem = document.createElement('li')
    createItem.innerHTML = `<a href=${show._links.self.href}>${show.name}</a>`
    const finalShowList = document.getElementById('showList')
    finalShowList.appendChild(createItem)
    $('#showList').show()
    $('#show').hide()
    return
}

(function ($) {
    $(document).ready(function () {
        const requestConfig = {
            method: 'GET',
            url: 'http://api.tvmaze.com/shows',
        }
        $.ajax(requestConfig).then(function (showsPayload) {
            showsPayload.map((show) => {
                injectTag(show)
            })
        })
    })

    $(document).ready(function () {
        $('#searchForm').on('submit', function () {
            const searchValue = search_term?.value
            $('#show').hide()
            $('#showList').empty()
            $('#homeLink').show()
            $('#searchForm').trigger('reset')
            if (searchValue && searchValue.trim().length === 0) {
                const error = document.getElementById('formError')
                error.innerHTML = 'Please input valid input text'
                return false
            }

            const requestConfig = {
                method: 'GET',
                url: `http://api.tvmaze.com/search/shows?q=${searchValue}`,
            }

            $.ajax(requestConfig).then(function (showsPayload) {
                if (showsPayload.length === 0) {
                    const error = document.getElementById('formError')
                    error.innerHTML = 'No shows found'
                } else {
                    const error = document.getElementById('formError')
                    error.innerHTML = ''
                    $('#showList').show()
                    showsPayload.map((showData) => {
                        injectTag(showData?.show)
                    })
                }
            })
            return false
        })
    })
    $(document).ready(function () {
        $(document).on('click', 'ul li a', function (event) {
            event.preventDefault()
            event.stopImmediatePropagation()
            $('#showList').hide()
            $('#show').empty()
            $('#show').show()
            
            const linkValue = $(this).attr('href')

            const requestConfig = {
                method: 'GET',
                url: linkValue,
            }

            $.ajax(requestConfig).then(function (showPayload) {
                const showsDetail = {
                    ...showPayload,
                    summary: showPayload.summary?.replace(/<(.|\n)*?>/g, ''),
                }

                const name = showsDetail?.name ? showsDetail.name : 'N/A'
                const imgSrc = showsDetail?.image?.medium
                    ? showsDetail?.image?.medium
                    : 'public/no_image.jpeg'
                const lang = showsDetail?.language
                    ? showsDetail.language
                    : 'N/A'
                const avgRating = showsDetail?.rating?.average
                    ? showsDetail.rating.average
                    : 'N/A'
                const network = showsDetail?.network?.name
                    ? showsDetail.network.name
                    : 'N/A'
                const showSummary = showsDetail?.summary
                    ? showsDetail.summary
                    : 'N/A'
                $('#show')
                    .append(`<h1>${name}</h1>`)
                    .append(`<img src=${imgSrc}>`).append(`
                    <dl>
                    <dt>Language</dt>
                    <dd>
                       ${lang}
                    </dd>
                    <dt>Genres</dt>
                    <dd>
                    <ul class="mylist">
                    </ul>
                    </dd>
                    <dt>Average Rating</dt>
                    <dd>
                        ${avgRating}
                    </dd>
                    <dt>Network</dt>
                    <dd>
                        ${network}
                    </dd>
                    <dt>Summary</dt>
                    <dd>
                        ${showSummary}
                    </dd>
                    </dl>`)
                $('.mylist').append(
                    showsDetail.genres.length > 0
                        ? showsDetail.genres.map((item) =>
                              $('.mylist').append('<li>' + item + '</li>')
                          )
                        : $('.mylist').append('<li>N/A</li>')
                )
            })
            $('#homeLink').show()
        })
    })
})(window.jQuery)
