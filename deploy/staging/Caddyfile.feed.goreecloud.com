feed.goreecloud.com {
  tls {
    dns porkbun {
      api_key {$PORKBUN_API_KEY}
      api_secret_key {$PORKBUN_API_SECRET_KEY}
    }
    propagation_delay 30s
    propagation_timeout 10m
    resolvers 1.1.1.1 8.8.8.8
  }

  @feed_api {
    remote_ip 100.64.0.0/10
    path /api/greader.php*
  }
  handle @feed_api {
    reverse_proxy freshrss:80
  }

  @feed_web remote_ip 100.64.0.0/10
  handle @feed_web {
    reverse_proxy goreecloud-feed-staging:8080
  }

  respond "Forbidden" 403
}
